import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import superagent from 'superagent';
import { connect } from 'react-redux';
import { fetchServers } from '../../actions';

@connect()
class OauthCallback extends Component {
  state = {
    notReady: true,
    message: 'chotto matte kudasai...',
    redirect: '/s',
  };

  stopped = false;

  componentDidUnmount() {
    this.stopped = true;
  }

  async componentDidMount() {
    // handle stuff in the url
    const sp = new URLSearchParams(this.props.location.search);
    const token = sp.get('code');

    if (token === '' || token == null) {
      this.setState({ message: 'token missing, what are you trying to do?!' });
      return;
    }

    const stateToken = sp.get('state');
    const state = JSON.parse(window.sessionStorage.getItem('state') || 'null');

    if (state !== null && state.state === stateToken && state.redirect != null) {
      this.setState({ redirect: state.redirect });
    }

    this.props.history.replace(this.props.location.pathname);

    let counter = 0;
    const retry = async () => {
      if (this.stopped) return;
      try {
        const rsp = await superagent.get('/api/auth/user');
        this.props.dispatch({
          type: Symbol.for('set user'),
          data: rsp.body,
        });
        this.props.dispatch(fetchServers);
        this.setState({ notReady: false });
      } catch (e) {
        counter++;
        if (counter > 10) {
          this.setState({ message: "i couldn't log you in. :c" });
        } else {
          setTimeout(() => {
            retry();
          }, 250);
        }
      }
    };

    // pass token to backend, await it to finish it's business.
    try {
      await superagent.post('/api/auth/token').send({ token });
      // this.props.onLogin(rsp.body)

      retry();
    } catch (e) {
      console.error('token pass error', e);
      this.setState({ message: 'g-gomen nasai... i broke it...' });
      return;
    }

    // update user stuff here
  }

  render() {
    return this.state.notReady ? (
      this.state.message
    ) : (
      <Redirect to={this.state.redirect} />
    );
  }
}

export default OauthCallback;
