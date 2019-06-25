/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
type State = {
  db: SQLite.SQLiteDatabase;
  users: Array<IUser>;
}

export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const db = SQLite.openDatabase(
        {
          name: 'SummerDB.db',
          location: 'default',
          createFromLocation: '~www/SummerDB.db',
        },
        () => {},
        error => {
          console.log(error);
        }
    );

    this.state = {
      db,
      users: [],
    };
  }

  componentDidMount() {
    const { db } = this.state;

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM test;', [], (tx, results) => {
        const rows = results.rows;
        let users = [];

        for (let i = 0; i < rows.length; i++) {
          users.push({
            ...rows.item(i),
          });
        }

        this.setState({ users });
      });
    });
  }

  componentWillUnmount() {
    const { db } = this.state;

    db.close();
  }

  render() {
    const { users } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        {users.map((user: IUser, index: number) => (
            <View key={`user-info${index}`}>
              <Text style={styles.instructions}>{user.id}</Text>
              <Text style={styles.instructions}>{user.name}</Text>
              <Text style={styles.instructions}>{user.age}</Text>
              <Text style={styles.instructions}>{user.email}</Text>
            </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
