import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image, StatusBar, FlatList,  TouchableOpacity, } from "react-native";
import { styles } from "../components/MusicPlayer.style";
 import { Audio } from "expo-av";
import { displayTime } from "../components/util";
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { CircleButton, RectButton, SubInfo, DetailsDesc, DetailsBid, FocusedStatusBar, PlayerModal } from "../components";


 

const DetailsHeader = ({ data, navigation }) => (
  <View style={{ width: "100%", height: 373, marginTop: 100, }}>
    <Image
      source={data.image}
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
    />

    <CircleButton
      imgUrl={assets.left}
      handlePress={() => navigation.goBack()}
      left={15}
      top={StatusBar.currentHeight + 10}
    />
    
    

  </View>
  
);

const Details = ({ route, navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [playingSong, setPlayingSong] = useState({});
  const [isBuffering, setBuffering] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [isRewinding, setRewinding] = useState(false);
  const [currentPosition, setcurrentPosition] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [playbackObject, setPlaybackObject] = useState(null);
  const { data } = route.params;
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => playSong(item, index)}
    >
      <Image source={{ uri: item.image }} style={styles.coverImage} />
  
      <View style={{ flex: 1 }}>
        
          <Text style={styles.songName}>{item.name}</Text>
          <View style={styles.songInfo}>
          <Text style={styles.singerName}>{item.singer}</Text>
          <Text style={styles.songDuration}>{displayTime(item.duration)}</Text>

        </View>
      </View>
       
    </TouchableOpacity>
    
  );


  
  const keyExtractor = (bids) => item.uri;
  
  const playSong = async (bids, index) => {
    setModalVisible(true);
    setBuffering(true);
    setPlaying(false);
    setcurrentPosition(0);
    setCurrentSongIndex(index);
    setPlayingSong(bids);
  
    try {
      // Unload playback when change sound
      if (playbackObject !== null) {
        await playbackObject.unloadAsync();
      }
  
      // Play new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: bids.uri },
        { shouldPlay: true }
      );
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setPlaybackObject(sound);
    } catch (error) {
      alert("Can't play this song!");
    }
  };
  
  const onPlaybackStatusUpdate = ({
    isLoaded,
    isBuffering,
    isPlaying,
    error,
  }) => {
    if (!isLoaded) {
      if (error) {
        alert(`Encountered a fatal error during playback: ${error}`);
      }
    } else {
      setBuffering(isBuffering);
      setPlaying(isPlaying);
    }
  };
  
  const updatePosition = async (position) => {
    try {
      await playbackObject.setPositionAsync(position);
      setcurrentPosition(position);
      setRewinding(false);
    } catch (err) {
      console.log(err)
    }
  };
  
  const pauseOrResumeSong = async () => {
    if (isPlaying) {
      setPlaying(false);
      playbackObject.pauseAsync();
    } else {
      if (currentPosition === playingSong.duration) {
        setcurrentPosition(0);
        await playbackObject.replayAsync();
      } else {
        await playbackObject.playAsync();
      }
    }
  };
  
  const changeSong = (index) => {
    if (index < 0) index = data.bids.length - 1;
    else if (index == data.bids.length) index = 0;
  
    playSong(data.bids[index], index);
  };
  
  const stopPlaySong = () => {
    setModalVisible(false);
    setPlaying(false);
    playbackObject.unloadAsync();
  };
  
  // https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // Run time slider
    if (isPlaying && !isBuffering) {
      const interval = setInterval(async () => {
        const {
          positionMillis,
          durationMillis,
        } = await playbackObject.getStatusAsync();
  
        // Don't update position when user rewinding
        if (!isRewinding) setcurrentPosition(positionMillis || 0);
  
        // Stop sound if positionMillis equals durationMillis or less than 1 second
        if (positionMillis >= durationMillis - 900) {
          await playbackObject.setPositionAsync(durationMillis);
          setcurrentPosition(durationMillis);
          setPlaying(false);
          clearInterval(interval);
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [isPlaying, isBuffering, isRewinding]);
  return (

    
    <SafeAreaView style={{ flex: 1,  backgroundColor: "#121212" }}>
      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

 
      
      <FlatList
        data={data.bids}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: SIZES.extraLarge * 3,
        }}
        ListHeaderComponent={() => (
          <React.Fragment>
            <DetailsHeader data={data} navigation={navigation} />
          
            <View style={{ padding: SIZES.font }}>
              <DetailsDesc data={data} />

           
                <Text
                  style={{
                    fontSize: SIZES.font,
                    fontFamily: FONTS.semiBold,
                    color: COLORS.white,
                    textAlign: "center",
                  }}
                >
                 
                </Text>
                <View
        style={{
          width: "100%",
          top: 0,
          paddingVertical: SIZES.font,
          justifyContent: "center",
          alignItems: "center",
         
          zIndex: 1,
        }}
      >
        <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} />
      </View>
           
            </View>
          </React.Fragment>
        )}
      />
        <PlayerModal
        isModalVisible={isModalVisible}
        closeModal={stopPlaySong}
        playingSong={playingSong}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        currentSongIndex={currentSongIndex}
        currentPosition={currentPosition}
        setcurrentPosition={setcurrentPosition}
        setRewinding={setRewinding}
        updatePosition={updatePosition}
        pauseOrResumeSong={pauseOrResumeSong}
        changeSong={changeSong}
      />
    </SafeAreaView>
  );
};

export default Details;