/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {API} from '../constants/api';
import {Routes} from '../navigation';
import {getPostList, postApi} from '../services';
import {color, typography} from '../theme';
import {Divider, Text, Vertical} from '../ui-kit';
import {Loader} from '../ui-kit/loader';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';

const url = API.baseUrls[API.currentEnv] + API.authUrls.getPostList;

export const Dashboard = ({route}) => {
  const {token, flag} = route?.params ?? {};
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [postWholeData, setPostWholeData] = useState(null);
  const [postList, setPostList] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [isConnected, setIsConnected] = useState(null);
  const [offlinePost, setOfflinePost] = useState(null);

  useEffect(() => {
    setLoading(true);
    NetInfo.addEventListener(handleConnectivityChange);

    if (isConnected) {
      const getLocalPostData = async () => {
        let offlinedata = await AsyncStorage.getItem('offlinePOstData');
        setOfflinePost(JSON.parse(offlinedata));
        if (offlinePost) {
          const data = new FormData();
          data.append('title', offlinePost.title);
          data.append('category', offlinePost.category);
          data.append('media_list', {
            uri: offlinePost?.media_list[0]?.uri,
            type: offlinePost?.media_list[0]?.type,
            name: offlinePost?.media_list[0]?.fileName,
          });

          data.append('website', offlinePost.website);
          data.append('description', offlinePost.description);
          postApi(token, data)
            .then((res) => {
              Toast.show('Your offline post is successfully created');
            })
            .catch((e) => {
              console.log('error', e);
              Toast.show('Your offline post is not successfully created');
            });
        }
      };

      getPostList(token, url).then(async (res) => {
        await AsyncStorage.setItem('postList', JSON.stringify(res?.data));
        setLoading(false);
        setPostWholeData(res?.data);
        setPostList(res?.data?.results);
        if (res?.data?.next) {
          setNextPage(nextPage + 1);
        }
      });
      getLocalPostData();
    } else {
      const getLocalStorage = async () => {
        setLoading(false);
        let localListData = await AsyncStorage.getItem('postList');
        if (localListData) {
          setPostWholeData(JSON.parse(localListData));
          setPostList(JSON.parse(localListData?.results));
          // setNextPage(JSON.parse(localListData?.next?.split('?')));
          if (JSON.parse(localListData?.next)) {
            setNextPage(nextPage + 1);
          }
        }
      };
      getLocalStorage();
    }
  }, [token, flag, isConnected]);

  const handleConnectivityChange = (connection) => {
    setIsConnected(connection.isConnected);
  };

  const renderPost = ({item}) => {
    return (
      <View style={styles.outerCard}>
        <View style={styles.rowView}>
          <View style={styles.innerRow}>
            <Image
              source={{uri: item?.creator_details?.avatar}}
              style={styles.image}
            />
            <Text style={styles.nameText}>{item?.creator_details?.name}</Text>
            {item?.creator_details?.verified_account && (
              <Image
                style={styles.verifyBadge}
                source={require('../assets/icon/verify.png')}
              />
            )}
          </View>
          <Image
            source={
              item?.is_post_saved
                ? require('../assets/icon/fillBookMark.png')
                : require('../assets/icon/outlineBookMark.png')
            }
            style={styles.savePost}
          />
        </View>
        <Vertical size={5} />
        <Divider />
        <Vertical size={5} />
        <Text style={styles.titleText}>{item?.title}</Text>
        <Text style={[styles.titleText, {fontFamily: typography.primary}]}>
          {item?.description}
        </Text>
        <Text>{item?.website}</Text>
        <Vertical size={5} />
        {item?.materials?.map((items, index) => {
          return (
            <Image source={{uri: items?.media_file}} style={styles.postImage} />
          );
        })}
        <Vertical size={5} />
        <Divider />
        <Vertical size={5} />
        <View style={styles.innerRow}>
          <Image
            source={
              item?.liked
                ? require('../assets/icon/like.png')
                : require('../assets/icon/notLike.png')
            }
            style={styles.savePost}
          />
          <View style={{marginLeft: 20}}>
            <Image
              source={require('../assets/icon/view.png')}
              style={[
                styles.savePost,
                {
                  height: 20,
                  width: 20,
                  tintColor: color.palette.black,
                },
              ]}
            />
            <Text style={{textAlign: 'center'}}>{item?.views_count}</Text>
          </View>
          <View style={{marginLeft: 20}}>
            <Image
              source={require('../assets/icon/comment.png')}
              style={[
                styles.savePost,
                {
                  height: 20,
                  width: 20,
                  tintColor: color.palette.black,
                },
              ]}
            />
            <Text style={{textAlign: 'center'}}>{item?.comment_count}</Text>
          </View>
        </View>
      </View>
    );
  };

  const endReached = () => {
    const pagUrl = url + `?page=${nextPage}`;
    if (postWholeData?.next && isConnected) {
      getPostList(token, pagUrl)
        .then((res) => {
          setPostWholeData(res?.data);
          setPostList(postList?.concat(res?.data?.results));
          if (res?.data?.next) {
            setNextPage(nextPage + 1);
          }
        })
        .catch((e) => {
          console.log('err', e);
        });
    }
  };

  const renderFooter = () => {
    return (
      <View>
        {isConnected && (
          <>
            {postWholeData?.next ? (
              <Text style={styles.footerText}>Loading More</Text>
            ) : (
              <Text style={styles.footerText}>No more result</Text>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!loading ? (
        <>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate(Routes.ADDPOST, {token: token});
            }}>
            <Image
              source={require('../assets/icon/add.png')}
              style={styles.plusIcon}
            />
          </TouchableWithoutFeedback>

          <FlatList
            data={postList}
            renderItem={renderPost}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            onEndReachedThreshold={0.7}
            onEndReached={endReached}
            ListFooterComponent={renderFooter}
          />
        </>
      ) : (
        <Loader />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: typography.primary,
    marginVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: color.palette.white,
  },
  plusIcon: {
    height: 50,
    width: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 4,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: color.palette.textGrey,
  },
  verifyBadge: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    marginLeft: 10,
  },
  nameText: {
    fontFamily: typography.primary,
    fontSize: 16,
    marginLeft: 20,
    alignSelf: 'center',
  },
  innerRow: {
    flexDirection: 'row',
  },
  savePost: {
    height: 30,
    width: 30,
  },
  outerCard: {
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: color.palette.cardGrey,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  titleText: {
    fontFamily: typography.secondary,
    fontSize: 18,
  },
  postImage: {
    height: 100,
    // width: Dimensions.get('window').width,
    borderRadius: 10,
    backgroundColor: color.palette.textGrey,
  },
});
