import React from 'react';
import SDK from './sdk';

// Material UI
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import List, { ListItem } from 'material-ui/List';

import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import RestoreIcon from 'material-ui-icons/Restore';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import PersonAddIcon from 'material-ui-icons/PersonAdd';
import FaceIcon from 'material-ui-icons/Face';

const PANEL = {
  FRIENDS: { num: 0, title: 'Friends' },
  MOMENTS: { num: 1, title: 'Moments' },
  ME: { num: 2, title: 'Me' }
};

class App extends React.Component {

  constructor (props) {
    super(props);
    this.updateArticles();
  }

  state = {
    panel: PANEL.MOMENTS.num,
    panelTitle: PANEL.MOMENTS.title,
    articles: []
  };

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
                <FaceIcon style={{ fontSize: '35px' }} />
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

  panelChange = (event, panelNumber) => {

    let panelTitle;
    if (panelNumber === PANEL.FRIENDS.num) {
      panelTitle = PANEL.FRIENDS.title;
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

  render() {

    let body;
    if (this.state.panel === 1) {
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

        <div style={{ border: '1px solid blue', marginTop: '-5px', marginBottom: '45px' }}>
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
      </div>
    );
  }
}

export default App;
