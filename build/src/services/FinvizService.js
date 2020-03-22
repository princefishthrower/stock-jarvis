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
Object.defineProperty(exports, "__esModule", { value: true });
var JSSoup = require("jssoup").default;
var fetch = require("node-fetch");
var FinvizTicker = /** @class */ (function () {
    function FinvizTicker(ticker) {
        FinvizTicker.ticker = ticker.toUpperCase();
        FinvizTicker.url =
            "http://finviz.com/quote.ashx?t=" + FinvizTicker.ticker;
    }
    FinvizTicker.prototype.setMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metrics, body, soup, table, rows;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metrics = {};
                        return [4 /*yield*/, fetch(FinvizTicker.url)
                                .then(function (res) { return res.text(); })
                                .then(function (body) { return body; })];
                    case 1:
                        body = _a.sent();
                        if (body.includes("We cover only stocks and ETFs listed on NYSE, NASDAQ, and AMEX. International and OTC/PK are not available.")) {
                            throw new Error("Stock ticker '" +
                                FinvizTicker.ticker +
                                "' does not exist on the Finviz.");
                        }
                        soup = new JSSoup(body);
                        table = soup.find("table", { class: "snapshot-table2" });
                        rows = table.findAll("tr");
                        // Loop through the rows and build a dictionary of the elements
                        rows.forEach(function (row) {
                            // Extracts the columns of each row
                            var cols = row.findAll("td");
                            // Check if there is an even number of columns (should always be)
                            if (cols.length % 2 == 0) {
                                var colTexts = cols.map(function (col) { return col.text; });
                                var keys = colTexts
                                    .filter(function (colText, index) { return index % 2 === 0; })
                                    .map(function (key) { return key.toString(); });
                                var values_1 = colTexts
                                    .filter(function (colText, index) { return index % 2 !== 0; })
                                    .map(function (value) { return value.toString(); });
                                var keyValuePairs = keys.map(function (key, index) {
                                    return [key, values_1[index]];
                                });
                                keyValuePairs.forEach(function (keyValue) {
                                    metrics[keyValue[0]] = keyValue[1];
                                });
                                _this.metrics = metrics;
                            }
                            else {
                                throw new Error("Dude, the Finviz table doesn't have an even number of columns!");
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return FinvizTicker;
}());
exports.default = FinvizTicker;
