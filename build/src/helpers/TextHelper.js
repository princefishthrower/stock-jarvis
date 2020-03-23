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
var FinvizService_1 = __importDefault(require("../services/FinvizService"));
var settings_json_1 = __importDefault(require("../../settings.json"));
var TextHelper = /** @class */ (function () {
    function TextHelper() {
    }
    TextHelper.buildAudioUpdateText = function () {
        return __awaiter(this, void 0, void 0, function () {
            var audioUpdateText, tickerTexts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        audioUpdateText = this.buildHourAndMinutePreamble();
                        return [4 /*yield*/, Promise.all(settings_json_1.default.audioUpdate.tickers.map(function (ticker) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.buildTickerText(ticker)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }))];
                    case 1:
                        tickerTexts = _a.sent();
                        audioUpdateText += tickerTexts.join("");
                        audioUpdateText += "Have a nice day!";
                        return [2 /*return*/, audioUpdateText];
                }
            });
        });
    };
    TextHelper.buildHourAndMinutePreamble = function () {
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var minuteToSay = minute === 1 ? "o'clock" : minute.toString();
        var preamble = "It is " + hour.toString() + " " + minuteToSay + ". ";
        if (hour === 9 && minute === 1) {
            preamble +=
                "Good morning, " +
                    settings_json_1.default.username +
                    ". Premarket trading is open. ";
        }
        else if (hour === 9 && minute === 30) {
            preamble += "Normal trading hours have begun. ";
        }
        else if (hour === 16 && minute === 1) {
            preamble += "Normal trading hours have closed. ";
        }
        else if (hour === 18 && minute === 1) {
            preamble += "After hours trading has just closed. ";
        }
        else if (hour > 18) {
            preamble += "After hours trading has closed. ";
        }
        return preamble;
    };
    TextHelper.buildTickerText = function (ticker) {
        return __awaiter(this, void 0, void 0, function () {
            var tickerData, direction, priceParts, directionalText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tickerData = new FinvizService_1.default(ticker);
                        // TODO:
                        // const tickerData = new ThinkOrSwimService(ticker);
                        return [4 /*yield*/, tickerData.setMetrics()];
                    case 1:
                        // TODO:
                        // const tickerData = new ThinkOrSwimService(ticker);
                        _a.sent();
                        direction = tickerData.metrics.Change &&
                            tickerData.metrics.Change.length > 0 &&
                            tickerData.metrics.Change[0] === "-"
                            ? "down"
                            : "up";
                        priceParts = tickerData.metrics.Price.split('.');
                        directionalText = ticker +
                            " is trading " +
                            direction +
                            " " +
                            tickerData.metrics.Change.slice(1, tickerData.metrics.Change.length) +
                            ", at " +
                            priceParts[0] + " dollars and " + priceParts[1] + " cents. ";
                        return [2 /*return*/, directionalText + "I repeat, " + directionalText];
                }
            });
        });
    };
    return TextHelper;
}());
exports.default = TextHelper;
