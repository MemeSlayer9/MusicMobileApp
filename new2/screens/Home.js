import React, { useState } from "react";
import { HomeHeader, NFTCard, FocusedStatusBar } from "../components";
import { View, SafeAreaView, FlatList, Text,  } from "react-native";
import {  PLAYLIST, NFTData } from "../constants/dummy";
import { COLORS,   } from "../constants";

const Home = () => {

const [q, setNftData] = useState(PLAYLIST);

const handleSearch = (value) => {
  if (value.length === 0) {
    setNftData(PLAYLIST);
  }

  const filteredData = PLAYLIST.filter((item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  );

  if (filteredData.length === 0) {
    setNftData(PLAYLIST);
  } else {
    setNftData(filteredData);
  }
};
   return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
          <FocusedStatusBar backgroundColor={COLORS.primary} />

    <View style={{ flex: 1, }}>
    
    <View style={{ zIndex: 0 }}>
    
     <FlatList
        numColumns={2}

       data={q}
       
      renderItem={({ item }) => <NFTCard data={item} /> }
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<HomeHeader onSearch={handleSearch} />}
     />
    
       
          </View>
  </View> 
  
   </SafeAreaView>

  )
}

export default Home