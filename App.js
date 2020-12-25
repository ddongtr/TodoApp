// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator, ImageBackground } from 'react-native';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AntDesign } from '@expo/vector-icons';
import colors from './Colors';
// import tempData from './tempData';
import TodoList from './components/TodoList';
import AddListModal from './components/AddListModal';
import Fire from './Fire';
import { LogBox } from 'react-native';
import _ from 'lodash';

LogBox.ignoreAllLogs(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class App extends React.Component {
	state = {
		addTodoVisible: false,
		lists: [],
		user: {},
		loading: true
	};
	
	componentDidMount() {
		firebase = new Fire((error, user) => {
			if (error) {
				return alert("Oops, something went wrong!");
			}

			firebase.getLists(lists => {
				this.setState({ lists, user }, () => {
					this.setState({ loading: false });
				});
			});

			this.setState({ user });
		});
	};

	toggleAddTodoModal() {
			this.setState({addTodoVisible: !this.state.addTodoVisible})
	};
	
	renderList = list => {
		return <TodoList list={list} updateList={this.updateList} deleteList={this.deleteList} />
	};

	addList = list => { 
		firebase.addList({
			name: list.name,
			color: list.color,
			todos: []
		});
	};

	updateList = list => {
		firebase.updateList(list);
	};

	deleteList = list => {
		firebase.deleteList(list);
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={styles.container}>
					<ActivityIndicator size="large" color={colors.blue} />
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<ImageBackground source={require('./image/background.jpg')} style={styles.background}>
				<Modal
					animationType="slide"
					visible={this.state.addTodoVisible}
					onRequestClose={() => this.toggleAddTodoModal()}>
					<AddListModal closeModal={() => this.toggleAddTodoModal()} addList={this.addList} />
				</Modal>
				{/* <View>
					<Text>User: {this.state.user.uid}</Text>
				</View> */}
				<View style={{ flexDirection: "row" }}>
					<View style={styles.devider} />
					<Text style={styles.title}>
						Todo <Text style={{ fontWeight: "300", color: colors.blue }}>List</Text>
					</Text>
					<View style={styles.devider} />
				</View>
					
				<View style={{ marginVertical: 48 }}>
					<TouchableOpacity style={styles.addList} onPress={() => this.toggleAddTodoModal()}>
						<AntDesign name="plus" size={16} color={colors.white} />
					</TouchableOpacity>

					<Text style={styles.add}>Add List</Text>
				</View>

				<View style={{ height: 275, paddingLeft: 32 }}>
					<FlatList
						data={this.state.lists}
						keyExtractor={item => item.id.toString()}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) => this.renderList(item)}
						keyboardShouldPersistTaps="always"
					/>
				</View>
				</ImageBackground>
			</View>
		);
	};
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
		//flexDirection: 'column'
	},
	devider: {
		backgroundColor: colors.white,
		height: 2,
		flex: 1,
		alignSelf: "center"
	},
	title: {
		fontSize: 38,
		fontWeight: "800",
		color: colors.white,
		paddingHorizontal: 64,
	},
	addList: {
		borderWidth: 2,
		borderColor: colors.lightBlue,
		borderRadius: 4,
		padding: 16,
		alignItems: "center",
		alignSelf: "center"
		//justifyContent: "center"
	},
	add: {
		color: colors.white,
		fontWeight: "600",
		fontSize: 14,
		marginTop: 8,
		alignSelf: "center"
	},
	background: {
		flex: 1,
		resizeMode: "cover",
		justifyContent: "center",
		alignItems:'center'
	},
});
