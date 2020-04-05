import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { withCookies, Cookies } from "react-cookie";

interface IProps {
    cookies: Cookies
}

interface IState {
    url: string;
    needsLogin: boolean;
}

class AuthStack extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            url: "",
            needsLogin: true,
        };
        this.getClientId = this.getClientId.bind(this);
    }
    componentDidMount() {
        const { cookies } = this.props;
        const token = cookies.get("token");
        if (token) {
            console.log(
                "they have the token cookie set, no auth needed, dont show auth link"
            );
            this.setState({
                needsLogin: false,
            });
        } else {
            console.log("no cookie found, show auth link");
            this.setState({
                needsLogin: true,
            });
        }

        this.getClientId();
    }
    async getClientId() {
        const redirectUri = "http://localhost:3000/stock-jarvis-oauth-callback";
        const scope = "profile email openid";
        const responseType = "code";
        const response = await fetch("http://localhost:3000/client-id");
        const json = await response.json();
        this.setState({
            url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${json.clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=offline&include_granted_scopes=true`,
        });
    }
    render() {
        const { url, needsLogin } = this.state;
        return (
            <>
                {needsLogin && url.length > 0 && <Login url={url} />}
                {!needsLogin && <Dashboard />}
            </>
        );
    }
}
export default withCookies(AuthStack);