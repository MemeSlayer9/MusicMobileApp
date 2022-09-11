import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Image, StatusBar, FlatList, TouchableOpacity } from "react-native";

import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
 import { CircleButton, RectButton, SubInfo, DetailsDesc, DetailsBid, FocusedStatusBar, BarMusicPlayer } from "../components";
import { Ionicons } from '@expo/vector-icons';
import { Audio,  } from 'expo-av';
import Slider from "@react-native-community/slider";

import { MaterialIcons } from '@expo/vector-icons';
 

const DetailsHeader = ({ data, navigation }) => (
  
  <View style={{  height:"30%",
  marginTop: "10%",
   width:"100%", 
  justifyContent:"center",
  alignItems:"center", }}>
    <Image
      source={data.image}
      resizeMode="cover"
      style={{    height:"100%",
    width:"50%",
    borderRadius:10 }}
    />
    
     <CircleButton
      imgUrl={assets.left}
      handlePress={() => navigation.goBack()}
      left={15}
      top={StatusBar.currentHeight + 10}
    />

    <CircleButton
      imgUrl={assets.heart}
      right={15}
      top={StatusBar.currentHeight + 10}
    />
   
  </View>
);

export default function  Details  ({ route, navigation }) {
  const {  data } = route.params;

  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState (false);
  const [isSeeking, setIsSeeking] = useState(false);
   const [state, setState] = useState({
    playbackInstanceName: "LOADING_STRING",
    muted: false,
    playbackInstancePosition: 0,
    playbackInstanceDuration: 0,
    shouldPlay: false,
    isPlaying: false,
    isBuffering: false,
    isLoading: true,
    shouldCorrectPitch: true,
    volume: 1.0,
  });

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    loadNewPlaybackInstance(false);
  }, []);
  const loadNewPlaybackInstance = async (playing) => {
    if (this.playbackInstance != null) {
			await this.playbackInstance.unloadAsync();
			this.playbackInstance.setOnPlaybackStatusUpdate(null);
			this.playbackInstance = null;
		}
    const source = { uri: data.uri };
    const initialStatus = {
    	shouldPlay: playing,
      shouldCorrectPitch: state.shouldCorrectPitch,
    };

    const { sound } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      onPlaybackStatusUpdate
    );
    setPlaybackInstance(sound);
    setState((prev) => {
      return {
        ...prev,
        
        isLoading: false,
        playbackInstanceName: data.name,
      };
    });
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setState((prev) => {
        return {
          ...prev,
          playbackInstancePosition: status.positionMillis,
          playbackInstanceDuration: status.durationMillis,
          shouldPlay: status.shouldPlay,
          isPlaying: status.isPlaying,
          isBuffering: status.isBuffering,
          muted: status.isMuted,
          volume: status.volume,
          shouldCorrectPitch: status.shouldCorrectPitch,
        };
      });
      if (status.didJustFinish) {
			advanceIndex(true);
				updatePlaybackInstanceForIndex(true);
			}
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
        navigation.navigate("ErrorModalScreen", {
          text: "Please re start the application!",
        });
      }
    }
  };

  const advanceIndex = (forward) => {
		  (data + (forward ? 1 : data.length - 1)) %
			data.length;
	}

    async function updatePlaybackInstanceForIndex (playing)   {
	 updateScreenForLoading(true);
		 loadNewPlaybackInstance(playing);
	}


  const onPlayPausePressed = () => {
    if (playbackInstance != null) {
      if (state.isPlaying) {
        playbackInstance.pauseAsync();
      } else {
        playbackInstance.playAsync();
      }
  
  };
}
 
const handlePreviousTrack = () => {
  if (playbackInstance != null) {
    advanceIndex(false);
    updatePlaybackInstanceForIndex(state.shouldPlay);
  }
};

 
const handleNextTrack = () => {
  if (playbackInstance != null) {
    advanceIndex(true);
    updatePlaybackInstanceForIndex(state.shouldPlay);
  }
};

const onSeekSliderValueChange = () => {
  if (playbackInstance != null && !isSeeking) {
    setIsSeeking(true);
    setShouldPlayAtEndOfSeek(state.shouldPlay);
    playbackInstance.pauseAsync();
  }
};
const onSeekSliderSlidingComplete = async (value) => {
  if (playbackInstance != null) {
    setIsSeeking(false);
    const seekPosition = value * state.playbackInstanceDuration;
    if (shouldPlayAtEndOfSeek) {
      playbackInstance.playFromPositionAsync(seekPosition);
    } else {
      playbackInstance.setPositionAsync(seekPosition);
    }
  }
};
const getSeekSliderPosition = () => {
  if (
    playbackInstance != null &&
    state.playbackInstancePosition != null &&
    state.playbackInstanceDuration != null
  ) {
    return state.playbackInstancePosition / state.playbackInstanceDuration;
  }
  return 0;
};
const getMMSSFromMillis = (millis) => {
  const totalSeconds = millis / 1000;
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60);

  const padWithZero = (number) => {
    const string = number.toString();
    if (number < 10) {
      return "0" + string;
    }
    return string;
  };
  return padWithZero(minutes) + ":" + padWithZero(seconds);
};

const getTimestamp = () => {
  if (
    playbackInstance != null &&
    state.playbackInstancePosition != null &&
    state.playbackInstanceDuration != null
  ) {
    return `${getMMSSFromMillis(
      state.playbackInstancePosition
    )} / ${getMMSSFromMillis(state.playbackInstanceDuration)}`;
  }
  return "";
};
const goTenSecondForwardOrBackward = (value) => {
  playbackInstance?.setStatusAsync({
    positionMillis: state.playbackInstancePosition + value,
  });
};
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          paddingVertical: SIZES.font,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.5)",
          zIndex: 1,
        }}
      >
       </View>
  
            <DetailsHeader data={data} navigation={navigation} />
         
            <View style={{ flex: 1, padding: 50, backgroundColor: '#fff' }}>
            <View style={{ height:"15%",
    width:"100%",
    alignItems:"center",
    justifyContent:"center"}}> 
            <Text style={{  fontSize:19,
    fontWeight:"500"}}>{data.name}</Text>
            </View>
          
          <Text>
                {state.isBuffering ? "...BUFFERING..." : ""}
                <Text>
                  {getTimestamp()}
                </Text>
              </Text>
          <Slider
            value={getSeekSliderPosition()}
            onValueChange={() => onSeekSliderValueChange}
            onSlidingComplete={onSeekSliderSlidingComplete}
            disabled={state.isLoading}
           
          />
          <View style={{  flexDirection:"row",
    height:"20%",
    width:"100%",
    alignItems:"center"}}>
             <TouchableOpacity >
					<MaterialIcons
           onPress={goTenSecondForwardOrBackward}
								name="fast-rewind"
								size={40}
								color="#56D5FA"
                style={{marginLeft:"20%"}}
							/>
					</TouchableOpacity>
          <TouchableOpacity >
        <Ionicons
          style={{
            alignSelf: 'center',
            backgroundColor: 'gray',
            padding: 10,
            borderRadius: 50,
            marginLeft:"15%",
          }}
          name={state.isPlaying ? 'pause' : 'play'}
          size={24}
          color='white'
          onPress={onPlayPausePressed}
          
        />
        </TouchableOpacity>
        <TouchableOpacity >
					<MaterialIcons
        onPress={goTenSecondForwardOrBackward}
								name="fast-forward"
								size={40}
								color="#56D5FA"
                style={{marginLeft:"30%"}}
							/>
					</TouchableOpacity>
      </View>
      
      </View>
      
       
     
    </SafeAreaView>
    
  );
};

 