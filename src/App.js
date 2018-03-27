import React from 'react';
import SDK from './sdk';

// Material UI
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import List, { ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import RestoreIcon from 'material-ui-icons/Restore';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import PersonAddIcon from 'material-ui-icons/PersonAdd';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import logo from './northeastern.png';

const PANEL = {
  FRIENDS: { num: 0, title: 'Friends' },
  MOMENTS: { num: 1, title: 'Moments' },
  ME: { num: 2, title: 'Me' }
};

class App extends React.Component {

  constructor (props) {
    super(props);
    this.updateArticles();
    this.updateUsers();
  }

  state = {
    isLogin: false,
    username: '',
    password: '',

    dialogOpen: false,
    dialogTitle: '',
    dialogMessage: '',

    panel: PANEL.MOMENTS.num,
    panelTitle: PANEL.MOMENTS.title,
    articles: [],
    users: []
  }

  token = '';

  register = () => {
    console.log('register');

    if (this.state.username === '' || this.state.password === '') {
      this.setState({ dialogOpen: true, dialogTitle: 'Register Failed', dialogMessage: 'The required fields should not be empty.' });
      return;
    }

    SDK.user.register(this.state.username, this.state.password, this.state.email)
      .then(user => {
        this.token = user.token;
        this.setState({
          isLogin: true,
          dialogOpen: true,
          dialogTitle: 'Register Success',
          dialogMessage: 'Welcome!!'
        });
      })
      .catch(err => {
        this.setState({ dialogOpen: true, dialogTitle: 'Register Failed', dialogMessage: err.message });
      });
  }

  login = () => {
    console.log('login');

    if (this.state.username === '' || this.state.password === '') {
      this.setState({ dialogOpen: true, dialogTitle: 'Login Failed', dialogMessage: 'Username and Password should not be empty.' });
      return;
    }

    SDK.user.login(this.state.username, this.state.password)
      .then(user => {
        this.token = user.token;
        this.token = user.token;
        this.setState({
          isLogin: true,
          dialogOpen: true,
          dialogTitle: 'Login Success',
          dialogMessage: 'Welcome!!'
        });
      })
      .catch(err => {
        this.setState({ dialogOpen: true, dialogTitle: 'Register Failed', dialogMessage: err.message });
      })
  }

  updateArticles = () => {
    SDK.article.getAll()
      .then(articles => {

        console.log('updateArticles');

        const listItems = articles.map(article => {

          let time = new Date() - new Date(article.timestamp);
          let unit = 'sec';
          time = Math.floor(time / 1000);
          if (time > 60) {
            time = Math.floor(time / 60);
            unit = 'min';
          }
          if (time > 60) {
            time = Math.floor(time / 60);
            unit = 'hr';
          }
          if (time > 24) {
            time = Math.floor(time / 24);
            unit = 'day(s)';
          }

          return (
            <ListItem key={article.articleId} style={{ borderBottom: '1px solid blue', height: '60px' }}>
              <div style={{ height: '35px', width: '35px', marginRight: '12px' }}>
                <Avatar>{article.author.slice(0, 2).toUpperCase()}</Avatar>
              </div>
              <div>
                <div>@{ article.author } ({ time + unit})</div>
                <div style={{ marginTop: '5px' }}>
                  { article.body }
                </div>
              </div>
            </ListItem>
          );
        });

        this.setState({ articles: listItems });
      })
      .catch(console.error);
  }

  updateUsers = () => {
    SDK.user.getAll()
      .then(users => {
        console.log('updateUsers');

        const listItems = users.map((user, index) => {
          return (
            <ListItem key={index} style={{ borderBottom: '1px solid blue', height: '60px' }}>
              <div style={{ height: '35px', width: '35px', marginRight: '12px' }}>
                <Avatar>{user.slice(0, 2).toUpperCase()}</Avatar>
              </div>
              <div>
                <div>{user}</div>
              </div>
            </ListItem>
          );
        });

        this.setState({ users: listItems });
      })
      .catch(console.error);
  }

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  }

  panelChange = (event, panelNumber) => {

    let panelTitle;
    if (panelNumber === PANEL.FRIENDS.num) {
      panelTitle = PANEL.FRIENDS.title;
      this.updateUsers();
    }

    if (panelNumber === PANEL.MOMENTS.num) {
      panelTitle = PANEL.MOMENTS.title;
      this.updateArticles();
    }

    if (panelNumber === PANEL.ME.num) {
      panelTitle = PANEL.ME.title;
    }

    this.setState({
      panel: panelNumber,
      panelTitle: panelTitle
    });
  };

  fieldOnChange = field => event => {
     this.setState({
       [field]: event.target.value,
     });
   };

  render() {

    // Sign Up and Login
    if (this.state.isLogin === false) {
      return (
        <div style={{ textAlign: 'center' }}>
          <div>
            <img src={logo} style={{ width: '75%', marginTop: '60px' }}/>

            <form noValidate autoComplete="off">
              <TextField
                required
                label="Username (unique)"
                value={this.state.username}
                onChange={this.fieldOnChange('username')}
                margin="normal"
              />
              <br/>
              <TextField
                style={{ marginBottom: '60px' }}
                required
                label="Password"
                type="password"
                value={this.state.password}
                onChange={this.fieldOnChange('password')}
                margin="normal"
              />
            </form>

            <Button variant="raised" color="primary" onClick={this.register}>
              Sign Up
            </Button>

            <Button variant="raised" color="primary" onClick={this.login} style={{ marginLeft: '40px' }}>
              Login
            </Button>

            <Dialog
              open={this.state.dialogOpen}
              onClose={this.closeDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{this.state.dialogTitle}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  { this.state.dialogMessage }
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      );
    }

    let body;
    if (this.state.panel === PANEL.FRIENDS.num) {
      body = <List> { this.state.users } </List>
    }

    if (this.state.panel === PANEL.MOMENTS.num) {
      body = <List> { this.state.articles } </List>
    }

    return (
      <div style={{ textAlign: 'center' }}>

        <AppBar position="sticky" style={{backgroundColor: 'WhiteSmoke', color: 'black'}}>
          <Toolbar>
            <Typography type="title" color="inherit" style={{ margin: 'auto', fontSize: '22px' }}>
              { this.state.panelTitle }
            </Typography>
          </Toolbar>
        </AppBar>

        <div style={{ marginTop: '-5px', marginBottom: '45px' }}>
          { body }
        </div>

        <BottomNavigation
          value={this.state.panel}
          onChange={this.panelChange}
          showLabels
          style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'WhiteSmoke' }}
        >
          <BottomNavigationAction label={PANEL.FRIENDS.title} icon={<PersonAddIcon />} />
          <BottomNavigationAction label={PANEL.MOMENTS.title} icon={<RestoreIcon />} />
          <BottomNavigationAction label={PANEL.ME.title} icon={<AccountCircleIcon />} />
        </BottomNavigation>

        <Dialog
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.state.dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              { this.state.dialogMessage }
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default App;
