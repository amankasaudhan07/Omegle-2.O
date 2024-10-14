import { Chat } from '../models/chat.js'
import { deletFilesFromCloudinary,  emitEvent,  uploadFilesToCloudinary } from '../utils/features.js';
import { ALERT, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from '../constants/events.js';
import { getOtherMember, getSockets } from '../lib/helper.js';
import { User } from '../models/user.js';
import { Message } from '../models/message.js'


const newGroupChat = async (req, res, next) => {
    const { name, members } = req.body;
    if (members.length < 2) {
        return res.status(400).json({ message: "Group chat must have at least 3 members", success: false });
    }

    try {
        const allMembers = [...members, req.user];


        await Chat.create({
            name,
            groupChat: true,
            creator: req.user,
            members: allMembers,
        })

        emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`)
        emitEvent(req, REFETCH_CHATS, members);


        return res.status(201).json({
            success: true,
            message: "Group created",
        })
    }
    catch (err) {
        return res.status(400).json({ message: "something went Wrong" })
    }
}

const getMyChats = async (req, res, next) => {


    try {
        const chats = await Chat.find({ members: req.user }).populate(
            "members", "name avatar"
        )

        const transformedChats = chats.map(({ _id, name, members, groupChat }) => {

            const otherMember = getOtherMember(members, req.user);
            // console.log("aman")

            return {
                _id,
                groupChat,
                avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => avatar.url) : [otherMember.avatar.url],
                name: groupChat ? name : otherMember.name,
                members: members.reduce((prev, curr) => {
                    if (curr._id.toString() !== req.user.toString()) {
                        prev.push(curr._id);
                    }
                    return prev;
                }, []),
            }
        })

        return res.status(200).json({
            success: true,
            chats: transformedChats,
        })
    }
    catch (err) {
        return res.status(400).json({ message: "something went Wrong" })
    }
}

const getMyGroups = async (req, res, next) => {

    try {
        const chats = await Chat.find({
            members: req.user,
            groupChat: true,
            creator: req.user,
        }).populate("members", "neme avatar");

        const groups = chats.map(({ members, _id, groupChat, name }) => ({
            _id,
            groupChat,
            name,
            avatr: members.slice(0, 3).map(({ avatar }) => avatar.url),
        }));

        return res.status(200).json({
            success: true,
            groups,

        })

    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
}

const addMembers = async (req, res, next) => {
    const { chatId, members } = req.body;

    // console.log(req.user);
    try {
        const chat = await Chat.findById(chatId);

        if (!members || members.length < 1) return res.status(400).json({ message: "Please Provides members", success: false });


        if (!chat) return res.status(404).json({ message: "Chat not found", success: false });

        if (!chat.groupChat)
            return res.status(400).json({ message: "This is not a group chat", success: false });

        if (chat.creator.toString() !== req.user.toString())
            return res.status(403).json({ message: "You are not allowed to add members", success: false });


        const allNewMembersPromise = members.map((id) => User.findById(id, "name"));

        // console.log("aman");
        const allNewMembers = await Promise.all(allNewMembersPromise);

        const uniqueMembers = allNewMembers
            .filter((i) => !chat.members.includes(i._id.toString()))
            .map((i) => i._id);

        chat.members.push(...uniqueMembers);

        if (chat.members.length > 100)
            return res.status(400).json({ message: "Group members limit reached", success: false });

        await chat.save();

        const allUsersName = allNewMembers.map((i) => i.name).join(", ");

        emitEvent(
            req,
            ALERT,
            chat.members,
            `${allUsersName} has been added in the group`
        );

        emitEvent(req, REFETCH_CHATS, chat.members);

        return res.status(200).json({
            success: true,
            message: "Members added successfully",
        });
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
};

const removeMember = async (req, res, next) => {
    const { userId, chatId } = req.body;

    try {
        const [chat, userThatWillBeRemoved] = await Promise.all([
            Chat.findById(chatId),
            User.findById(userId, "name"),
        ]);

        if (!chat) return res.status(404).json({ message: "Chat not found", success: false });

        if (!chat.groupChat)
            return res.status(400).json({ message: "This is not a group chat", success: false });

        if (chat.creator.toString() !== req.user.toString())
            return res.status(403).json({ message: "You are not allowed to remove members", success: false });

        if (chat.members.length <= 3)
            return res.status(400).json({ message: "Group must have at least 3 members", success: false });

        const allChatMembers = chat.members.map((i) => i.toString());

        chat.members = chat.members.filter(
            (member) => member.toString() !== userId.toString()
        );

        await chat.save();

        emitEvent(req, ALERT, chat.members, {
            message: `${userThatWillBeRemoved.name} has been removed from the group`,
            chatId,
        });

        emitEvent(req, REFETCH_CHATS, allChatMembers);

        return res.status(200).json({
            success: true,
            message: "Member removed successfully",
        });
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
};

const leaveGroup = async (req, res, next) => {
    const chatId = req.params.id;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) return res.status(404).json({ message: "Chat not found", success: false });

        if (!chat.groupChat)
            return res.status(400).json({ message: "This is not a group chat", success: false });

        const remainingMembers = chat.members.filter(
            (member) => member.toString() !== req.user.toString()
        );

        if (remainingMembers.length < 3)
            return res.status(400).json({ message: "Group must have at least 3 members", success: false });

        if (chat.creator.toString() === req.user.toString()) {
            const randomElement = Math.floor(Math.random() * remainingMembers.length);
            const newCreator = remainingMembers[randomElement];
            chat.creator = newCreator;
        }

        chat.members = remainingMembers;

        const [user] = await Promise.all([
            User.findById(req.user, "name"),
            chat.save(),
        ]);

        emitEvent(req, ALERT, chat.members, {
            chatId,
            message: `User ${user.name} has left the group`,
        });

        return res.status(200).json({
            success: true,
            message: "Leave Group Successfully",
        });
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
};

const sendAttachments = async (req, res) => {

    try {
        const { chatId } = req.body;

        const files = req.files || [];
        
        // console.log("files",files);

        if (files.length < 1)
            return res.status(400).json({ message: "Please Upload Attachments", success: false });

        if (files.length > 5)
            return res.status(400).json({ message: "Files Can't be more than 5", success: false });

        const [chat,me] = await Promise.all([
            Chat.findById(chatId),
            User.findById(req.user,"name"), 

        ]);

        //  console.log("chat",chat);

        if (!chat) return res.status(404).json({ message: "Chat not found", success: false });

        //   Upload files here
        const attachments = await uploadFilesToCloudinary(files);
        
        // console.log("attach",attachments)

        const messageForDB = {
            content: "",
            attachments,
            sender: me._id,
            chat: chatId,
        };
       
        
        const messageForRealTime = {
            ...messageForDB,
            sender: {
                _id: me._id,
                name: me.name,
            },
        };
        // console.log("db",messageForRealTime);

        const message = await Message.create(messageForDB);
       

       

        emitEvent(req, NEW_MESSAGE, chat.members, {
            message: messageForRealTime,
            chatId,
        });

        emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });
        

        return res.status(200).json({
            success: true,
            message,
        });
    }
    catch (err) {
        return res.status(400).json({ message: "something went wrong" });
    }
};

const getChatDetails = async (req, res) => {
    try {
        if (req.query.populate === "true") {
            // console.log("populate");
            const chat = await Chat.findById(req.params.id)
                .populate("members", "name avatar")
                .lean();

            if (!chat) return res.status(404).json({ message: "Chat not found", success: false });

            chat.members = chat.members.map(({ _id, name, avatar }) => ({
                _id,
                name,
                avatar: avatar.url,
            }));

            // console.log("chat",chat);

            return res.status(200).json({
                success: true,
                chat,
            });
        } else {
            // console.log("Not populate");
            const chat = await Chat.findById(req.params.id);
            if (!chat) return res.status(404).json({ message: "Chat not found", success: false });

            return res.status(200).json({
                success: true,
                chat,
            });
        }
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
};

const renameGroup = async (req, res) => {
    try {
        const chatId = req.params.id;
        const { name } = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) return es.status(404).json({
            message: "Chat not found", success: false
        })


        if (!chat.groupChat)
            return es.status(400).json({
                message: "This is not a group chat", success: false
            })


        if (chat.creator.toString() !== req.user.toString())
            return res.status(403).json({
                message: "You are not allowed to rename the group", success: false
            })


        chat.name = name;

        await chat.save();

        emitEvent(req, REFETCH_CHATS, chat.members);

        return res.status(200).json({
            success: true,
            message: "Group renamed successfully",
        });
    }
    catch (err) {
        throw (err);
    }
};

const deleteChat = async (req, res) => {

    try {

        const chatId = req.params.id;

        const chat = await Chat.findById(chatId);

        if (!chat) return res.status(404).json({ message: "Chat not found", success: false });

        const members = chat.members;

        if (chat.groupChat && chat.creator.toString() !== req.user.toString())
            return res.status(403).json({ message: "You are not allowed to delete the group", success: false });


        if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
            return res.status(403).json({ message: "You are not allowed to delete the chat", success: false });
        }

        //   Here we have to delete All Messages as well as attachments or files from cloudinary

        const messagesWithAttachments = await Message.find({
            chat: chatId,
            attachments: { $exists: true, $ne: [] },
        });

        const public_ids = [];

        messagesWithAttachments.forEach(({ attachments }) =>
            attachments.forEach(({ public_id }) => public_ids.push(public_id))
        );

        await Promise.all([
            deletFilesFromCloudinary(public_ids),
            chat.deleteOne(),
            Message.deleteMany({ chat: chatId }),
        ]);

        emitEvent(req, REFETCH_CHATS, members);

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
        });
    }
    catch (err) {
        throw (err);
    }
};


const getMessages = async (req, res) => {

    try {

        const chatId = req.params.id;
        const { page = 1 } = req.query;

        const resultPerPage = 20;
        const skip = (page - 1) * resultPerPage;

        const chat = await Chat.findById(chatId);

        if (!chat) return res.status(404).json({message:"Chat not found",success:false});

        if (!chat.members.includes(req.user.toString()))
            return res.status(403).json({message:"You are not allowed to access this chat",success:false});
        

        const [messages, totalMessagesCount] = await Promise.all([
            Message.find({ chat: chatId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(resultPerPage)
                .populate("sender", "name")
                .lean(),
            Message.countDocuments({ chat: chatId }),
        ]);

        const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

        return res.status(200).json({
            success: true,
            messages: messages.reverse(),
            totalPages,
        });
    }
    catch (err) {
        throw (err);
    }
};





export {
    newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup,
    deleteChat, getMessages
};