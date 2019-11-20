import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import superagent from 'superagent';
import discordLogo from '../../pages/images/discord-logo.svg';

export default class ServerLanding extends Component {
  state = {
    server: null,
    exit: false,
  };

  async componentWillMount() {
    console.log(this.props);

    try {
      const rsp = await superagent.get(
        `/api/server/${this.props.match.params.server}/slug`
      );
      this.setState({ server: rsp.body });
    } catch (e) {
      this.setState({ exit: true });
      return;
    }
  }

  render() {
    if (this.state.exit === true) {
      return <Redirect to="/" />;
    }

    if (this.state.server === null) {
      return null; //SPINNER
    }

    return (
      <div className="landing uk-width-1-1 uk-text-center">
        <div className="uk-container">
          <section>
            <h1>Hey there.</h1>
            <h4>
              {this.state.server.name} uses Roleypoly to manage self-assignable roles.
            </h4>
            <h5>
              <span role="img">💖</span>
            </h5>
          </section>
          <section>
            <Link
              to={`/oauth/flow?r=${window.location.pathname}`}
              className="uk-button rp-button discord"
            >
              <img src={discordLogo} className="rp-button-logo" /> Sign in with Discord
            </Link>
          </section>
        </div>
      </div>
    );
  }
}
