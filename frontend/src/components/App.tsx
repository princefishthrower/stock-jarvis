import React from "react";
import AuthStack from "./AuthStack";
import { CookiesProvider } from "react-cookie";

class App extends React.Component {
    render() {
        return (
            <CookiesProvider>
                <AuthStack />
            </CookiesProvider>
        );
    }
}

export default App;
