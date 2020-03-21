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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
var text_to_speech_1 = __importDefault(require("@google-cloud/text-to-speech"));
var spawn = require("child_process").spawn;
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, hour, minute, textToRead, data, spyData, direction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        hour = now.getHours();
                        minute = now.getMinutes();
                        textToRead = "It is " + hour.toString() + " " + minute.toString() + ". ";
                        if (hour === 9 && minute === 0) {
                            textToRead += "Good morning, Chris. Premarket trading is open. ";
                        }
                        else if (hour === 9 && minute === 30) {
                            textToRead += "Normal trading hours have begun. ";
                        }
                        else if (hour === 16 && minute === 0) {
                            textToRead += "Normal trading hours have closed. ";
                        }
                        else if (hour === 18 && minute === 0) {
                            textToRead += "After hours trading has just closed. ";
                        }
                        else if (hour > 18) {
                            textToRead += "After hours trading has closed. ";
                        }
                        // Write SPY data to JSON via python script
                        return [4 /*yield*/, this.getFinvizData(App.ticker)];
                    case 1:
                        // Write SPY data to JSON via python script
                        _a.sent();
                        data = fs_1.default.readFileSync("data/metrics.json");
                        spyData = JSON.parse(data.toString());
                        direction = spyData.Change && spyData.Change.length > 0 && spyData.Change[0] === "-"
                            ? "down"
                            : "up";
                        textToRead +=
                            App.ticker +
                                " is trading " +
                                direction +
                                " " +
                                spyData.Change.slice(1, spyData.Change.length) +
                                ", at " +
                                spyData.Price +
                                ". ";
                        return [4 /*yield*/, this.createMP3(textToRead)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.emitMP3()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.getFinvizData = function (ticker) {
        return __awaiter(this, void 0, void 0, function () {
            var pythonProcess;
            return __generator(this, function (_a) {
                pythonProcess = spawn("python", [
                    "python/getTickerMetrics.py",
                    ticker
                ]);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        pythonProcess.stdout.on("data", function (data) {
                            resolve();
                        });
                        pythonProcess.stderr.on("data", function (data) {
                            reject();
                        });
                    })];
            });
        });
    };
    App.prototype.createMP3 = function (textToRead) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, writeFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = {
                            input: { text: textToRead },
                            voice: {
                                languageCode: "en-GB",
                                name: "en-GB-Wavenet-C",
                                ssmlGender: 2 // 2 = FEMALE
                            },
                            audioConfig: { audioEncoding: 2 } // 2 = MP3
                        };
                        return [4 /*yield*/, App.client.synthesizeSpeech(request)];
                    case 1:
                        response = (_a.sent())[0];
                        writeFile = util_1.default.promisify(fs_1.default.writeFile);
                        return [4 /*yield*/, writeFile(App.mp3FilePath, response.audioContent, "binary")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.emitMP3 = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                spawn("open", [App.mp3FilePath]);
                return [2 /*return*/];
            });
        });
    };
    App.ticker = "SPY";
    App.client = new text_to_speech_1.default.TextToSpeechClient();
    App.mp3FilePath = "audio/audio.mp3";
    return App;
}());
exports.default = App;
