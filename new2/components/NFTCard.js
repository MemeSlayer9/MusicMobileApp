
import {
  
  TouchableOpacity,
   
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { View, Image,   Dimensions, Text
} from "react-native";

import { COLORS, SIZES, SHADOWS, assets } from "../constants";
import { SubInfo, EthPrice, NFTTitle } from "./SubInfo";
import { RectButton, CircleButton } from "./Button";

const width = Dimensions.get('window').width / 2 - 10;


const NFTCard = ({ data }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
     onPress={() => navigation.navigate("Details", { data })}
    > 
    <View
      style={{
        flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'space-between',
        borderRadius: SIZES.font,
        marginBottom: SIZES.extraLarge,
        margin: SIZES.base,
        ...SHADOWS.dark,
       
      }}
    >
      <View
        style={{
          height: 225,
    backgroundColor: COLORS.light,
    width,

    marginHorizontal: 2,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
        }}
      >
      
        <Image
          source={data.image}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderTopLeftRadius: SIZES.font,
            borderTopRightRadius: SIZES.font,
          }}
        />
            

  <NFTTitle
          title={data.name}
          
        />
 

       </View>

     
        
      
          
       </View>
     </TouchableOpacity>
  
  );
};

export default NFTCard;