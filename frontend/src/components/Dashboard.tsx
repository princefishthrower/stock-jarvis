import * as React from "react";
import Loader from "./Loader";
import IUserSettings from "../../../shared/interfaces/IUserSettings";

interface IProps {}

interface IState {
    isLoading: boolean;
    settings: IUserSettings | null;
}

export default class Dashboard extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: true,
            settings: null,
        };
    }
    public componentDidMount() {
        this.fetchSettings();
    }
    private fetchSettings() {
        fetch("http://localhost:3000/get-settings", {
            credentials: "include",
        }).then(async (res) => {
            if (res.ok) {
                const settings = await res.json();
                this.setState({
                    settings: settings,
                });
            }
        });
    }
    public render() {
        const { settings } = this.state;
        return (
            <>
                {!settings && <Loader />}
                {settings && (
                    <div id="user-info-wrapper">
                        <p>Hi, {settings.name}!</p>
                        <p>Your currently configured Stock Jarvis settings:</p>
                        <p>
                            Current audio triggers (triggered every{" "}
                            {settings.audioUpdateSettings.interval} minutes):
                            {settings.audioUpdateSettings.tickers.map(
                                (ticker) => {
                                    return (
                                        <li>
                                            {ticker}
                                        </li>
                                    );
                                }
                            )}
                        </p>
                        <p></p>
                        <p>
                            Current email notification triggers (triggered every{" "}
                            {settings.notificationUpdateSettings.interval}{" "}
                            minutes):
                        </p>
                        <ul>
                            {settings.notificationUpdateSettings.tickers.map(
                                (notificationTicker) => {
                                    return (
                                        <li>
                                            {notificationTicker.ticker}:<br />
                                            above{" "}
                                            ${notificationTicker.abovePrice}:
                                            Custom message "
                                            {notificationTicker.aboveMessage}"
                                            <br />
                                            below{" "}
                                            ${notificationTicker.belowPrice}:
                                            Custom message "
                                            {notificationTicker.belowMessage}"
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    </div>
                )}
            </>
        );
    }
}
