import fs from "fs";
import IMetricData from "../interfaces/IMetricData";
import { UpdateType } from "../enums/UpdateType";
const spawn = require("child_process").spawn;

export default class PythonHelper {
    public static async getFinvizMetrics(
        updateFolderType: UpdateType,
        ticker: string
    ): Promise<IMetricData> {
        const pythonProcess = spawn("python3", [
            "src/python/getTickerMetrics.py",
            updateFolderType,
            ticker
        ]);
        return new Promise((resolve, reject) => {
            pythonProcess.on("exit", (code: number) => {
                if (code === 0) {
                    const metrics = fs.readFileSync(
                        "data/" + updateFolderType + "/" + ticker + ".json"
                    );
                    resolve(JSON.parse(metrics.toString()));
                } else {
                    reject();
                }
            });
        });
    }
}
