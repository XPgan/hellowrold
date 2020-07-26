import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import MsgItem from './MsgItem';
import { SwipeListView } from 'react-native-swipe-list-view';

import { tim, TIM } from '../../../utils/tim';

import { layout } from '../../../utils/layout';
import { navigate } from '../../../RootNavigation';
import { px2dp, statusBarHeight, onePx } from '../../../utils/utils';
import { ItemConversationList } from '../../../utils/timType';
import { storeData, getData } from '../../../utils/Store';
import { debounce, conversion } from '../../../utils/comfuc';
import { array, any } from 'prop-types';
import { fromtots } from '../../../utils/fromtots';

const Msg = ({ dispatch, userInfo }: any) => {
	const { userid } = userInfo;
	const [ listData, setlistData ] = useState<Array<ItemConversationList>>([]);

	const [ msg, setmsg ] = useState({});

	useEffect(() => {
		const { tinyID = '' } = userInfo;

		getData('Save_conversation_List')
			.then((res) => {
				console.log('Save_conversation_List', res);
				res && setlistData(res);
			})
			.catch((err) => {
				// console.log(err);
			});

		if (tinyID) {
			postConversationList();
		}

		let onMessageReceived = function(event: any) {
			// SDK收到推送的单聊，群聊，群提示，群系统通知的新消息，可通过遍历event.data获取消息列表数据并渲染到页面

			console.log("'event'",event);
			let list = event.data[0];
			console.log(list);
			setlistData([list]);
		};
		tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
	}, []);

	const postConversationList = () => {
		let promise = tim.getConversationList();
		promise
			.then(function(imResponse: any) {
				console.log('拉取会话列表', imResponse);
				const { data: { conversationList: conList } } = imResponse;
				console.log(conList.length);

				// const conList: Array<ItemConversationList> = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
				if (conList.length > 0) {
					// 本地存储
					setlistData([ ...listData, ...conList ]);
					storeData('Save_conversation_List', conList);
				}
			})
			.catch(function(imError: any) {
				console.warn('get error:', imError); // 获取会话列表失败的相关信息
			});
	};


	return (
		<View style={layout.page}>
			<View style={styles.main}>
				<SwipeListView
					data={listData}
					keyExtractor={(item, index) => 'index' + index}
					renderItem={({ item }) => {
						return <MsgItem item={item} />;
					}}
					renderHiddenItem={(data, rowMap) => (
						<View style={styles.heidebg}>
							<View style={styles.delectbox}>
								<Text style={{}}>删除</Text>
							</View>
						</View>
					)}
					leftOpenValue={0}
					rightOpenValue={-75}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	main: {
		flex: 1
	},
	heidebg: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'rgb(245,245,245)',
		justifyContent: 'flex-end'
	},
	delectbox: {
		width: px2dp(150),
		height: px2dp(150),
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default connect((state) => state)(Msg);