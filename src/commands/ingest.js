"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingest = void 0;
var fs = require("fs");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var accessToken = process.env.ACCESS_TOKEN;
var roomId = process.env.ROOM_ID;
function ingest() {
    return __awaiter(this, void 0, void 0, function () {
        var hasMessages, lastMessageId, URL_1, response, data, messages, filteredMessages, messagesWithReplies, _i, filteredMessages_1, message, id, parentId, text, created, storeMessage, replies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hasMessages = true;
                    lastMessageId = "";
                    console.log("Starting...");
                    _a.label = 1;
                case 1:
                    if (!hasMessages) return [3 /*break*/, 8];
                    fs.appendFileSync("./messages.txt", "\n------\n");
                    URL_1 = lastMessageId == ""
                        ? "https://webexapis.com/v1/messages?roomId=".concat(roomId, "&max=15")
                        : "https://webexapis.com/v1/messages?roomId=".concat(roomId, "&max=100&beforeMessage=").concat(lastMessageId);
                    return [4 /*yield*/, fetch(URL_1, {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                            },
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = (_a.sent());
                    messages = data.items;
                    lastMessageId = data.items[data.items.length - 1].id;
                    filteredMessages = messages.filter(function (message) {
                        console.log("message: ", message);
                        console.log("message.parentId: ", message.parentId);
                        console.log("take it or not:", message.parentId == "" ||
                            message.parentId == null ||
                            message.parentId == undefined);
                        return (message.parentId == "" ||
                            message.parentId == null ||
                            message.parentId == undefined);
                    });
                    messagesWithReplies = [];
                    _i = 0, filteredMessages_1 = filteredMessages;
                    _a.label = 4;
                case 4:
                    if (!(_i < filteredMessages_1.length)) return [3 /*break*/, 7];
                    message = filteredMessages_1[_i];
                    id = message.id, parentId = message.parentId, text = message.text, created = message.created;
                    storeMessage = { id: id, parentId: parentId, text: text, created: created, level: "parent" };
                    // messagesWithReplies.push(storeMessage);
                    fs.appendFileSync("./messages.txt", "ID: ".concat(id, "\n Text: ").concat(text, "\n Date: ").concat(created, "\n"));
                    return [4 /*yield*/, fetchReplies(message.id)];
                case 5:
                    replies = _a.sent();
                    messagesWithReplies.push.apply(messagesWithReplies, replies);
                    fs.appendFileSync("./messages.txt", "\n------\n");
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    /*     fs.appendFileSync(
                      "./messages.json",
                      JSON.stringify(messagesWithReplies, null, 2)
                    ); */
                    hasMessages = false;
                    if (data.items.length < 100) {
                        // hasMessages = false;
                    }
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.ingest = ingest;
function fetchReplies(messageId) {
    return __awaiter(this, void 0, void 0, function () {
        var messagesWithReplies, repliesResponse, replyData, replyMessages, reversedMessages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Fetching replies for message ".concat(messageId));
                    messagesWithReplies = [];
                    return [4 /*yield*/, fetch("https://webexapis.com/v1/messages?roomId=".concat(roomId, "&max=100&parentId=").concat(messageId), {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                            },
                        })];
                case 1:
                    repliesResponse = _a.sent();
                    return [4 /*yield*/, repliesResponse.json()];
                case 2:
                    replyData = (_a.sent());
                    replyMessages = replyData.items;
                    console.log("replymessage: ", replyMessages);
                    if (replyMessages != undefined && replyMessages.length > 0) {
                        console.log("Found ".concat(replyMessages.length, " replies for message ").concat(messageId));
                        reversedMessages = replyMessages.slice().reverse();
                        reversedMessages.forEach(function (replyMessage) {
                            fs.appendFileSync("./messages.txt", "---\n");
                            var id = replyMessage.id, parentId = replyMessage.parentId, text = replyMessage.text, created = replyMessage.created;
                            var storeReply = { id: id, parentId: parentId, text: text, created: created, level: "child" };
                            fs.appendFileSync("./messages.txt", "ID: ".concat(id, "\n  ParentID: ").concat(parentId, "\n Text: ").concat(text, "\n Date: ").concat(created, "\n"));
                            // messagesWithReplies.push(storeReply);
                        });
                    }
                    return [2 /*return*/, messagesWithReplies];
            }
        });
    });
}
