import React from 'react';
import Svg, { 
  Circle, 
  Path, 
  Rect, 
  G, 
  Defs, 
  Pattern, 
  Use, 
  Filter, 
  FeFlood, 
  FeColorMatrix, 
  FeOffset, 
  FeGaussianBlur, 
  FeComposite, 
  FeBlend,
  LinearGradient,
  Stop
} from 'react-native-svg';

interface CaringLogoProps {
  width?: number;
  height?: number;
}

export const CaringLogo = ({ width = 48, height = 48 }: CaringLogoProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 58 58" fill="none">
      <Circle cx="29" cy="29" r="28.5" fill="#FFF7EE" stroke="#866650" />
      <Path d="M30.7539 0.914666H31.1524L31.1719 4.20792V6.35938H30.793L30.7539 0.914666Z" fill="#C9CED1" />
      <Path d="M22 35L26.9654 20H35.4144L41 35H22Z" fill="url(#paint0_linear_151_26310)" />
      <Rect x="24" y="2" width="14" height="21" fill="url(#pattern0_151_26310)" />
      <Path d="M29 0.5C44.7401 0.5 57.5 13.2599 57.5 29C57.5 44.7401 44.7401 57.5 29 57.5C13.2599 57.5 0.5 44.7401 0.5 29C0.5 13.2599 13.2599 0.5 29 0.5Z" stroke="#785B48" />
      
      <G filter="url(#filter0_d_151_26310)">
        <Path d="M13.2407 29.1221C13.1138 28.1826 12.4409 27.5859 11.4126 27.5859C10.0542 27.5859 9.229 28.6143 9.229 30.4043C9.229 32.2578 10.0796 33.2227 11.3999 33.2227C12.3901 33.2227 13.0757 32.6895 13.2407 31.7881L15.4243 31.8008C15.2466 33.4385 13.8501 35.127 11.3618 35.127C8.87354 35.127 7.02002 33.4258 7.02002 30.4043C7.02002 27.3701 8.91162 25.6816 11.3618 25.6816C13.5708 25.6816 15.1958 26.9258 15.4243 29.1221H13.2407ZM16.3511 33.083C16.3511 31.5596 17.5317 31.0137 18.9028 30.9248C19.3979 30.8931 20.2612 30.8613 20.5532 30.8486V30.29C20.5532 29.8076 20.1978 29.541 19.6138 29.541C19.0425 29.541 18.687 29.7822 18.5981 30.2393H16.605C16.6938 29.0205 17.7349 28.0176 19.6646 28.0176C21.3657 28.0176 22.6987 28.8301 22.6987 30.3154V35H20.6802V34.0352H20.6294C20.2485 34.7334 19.5884 35.127 18.6235 35.127C17.3032 35.127 16.3511 34.4541 16.3511 33.083ZM18.3823 32.9941C18.3823 33.4639 18.7505 33.7051 19.271 33.7051C19.9946 33.7051 20.5786 33.2354 20.5659 32.5498V32.1055C20.3057 32.1182 19.5757 32.1499 19.2583 32.1816C18.7251 32.2451 18.3823 32.5371 18.3823 32.9941ZM24.0063 35V28.1064H26.0884V29.3506H26.1519C26.4058 28.4492 27.0151 28.0049 27.7769 28.0049C27.98 28.0049 28.2085 28.043 28.3862 28.0811V29.9473C28.1831 29.8838 27.8022 29.8457 27.5356 29.8457C26.7358 29.8457 26.1519 30.4043 26.1519 31.2295V35H24.0063Z" fill="#5E4534" />
      </G>
      
      <G filter="url(#filter1_d_151_26310)">
        <Path d="M36.8457 31.0518V35H34.7002V28.1064H36.7314V29.3633H36.8076C37.125 28.5254 37.8867 28.0176 38.9023 28.0176C40.3496 28.0176 41.3018 29.0459 41.2891 30.6074V35H39.1562V31.0137C39.1562 30.2393 38.7373 29.7695 38.0264 29.7695C37.3154 29.7695 36.8457 30.252 36.8457 31.0518ZM45.834 37.7295C43.8535 37.7295 42.6729 36.8281 42.5713 35.5205H44.6533C44.7422 36.0156 45.2119 36.2314 45.8848 36.2314C46.6592 36.2314 47.1924 35.9141 47.1924 35.0127V33.7939H47.1162C46.8496 34.416 46.1895 34.9111 45.1611 34.9111C43.6377 34.9111 42.3936 33.8574 42.3936 31.5342C42.3936 29.1221 43.7012 28.0176 45.1484 28.0176C46.2529 28.0176 46.8496 28.665 47.1035 29.2871H47.167V28.1064H49.2998V35.0381C49.2998 36.79 47.8906 37.7295 45.834 37.7295ZM45.8848 33.3369C46.71 33.3369 47.1924 32.6641 47.1924 31.5342C47.1924 30.4043 46.7227 29.6934 45.8848 29.6934C45.0469 29.6934 44.5898 30.4297 44.5898 31.5342C44.5898 32.6641 45.0596 33.3369 45.8848 33.3369Z" fill="#5E4534" />
      </G>
      
      <G filter="url(#filter2_d_151_26310)">
        <Rect x="30" y="24" width="2" height="11" fill="#5E4534" />
      </G>
      
      <Defs>
        <Pattern id="pattern0_151_26310" patternContentUnits="objectBoundingBox" width="1" height="1">
          <Use href="#image0_151_26310" transform="matrix(0.00288184 0 0 0.00192123 0 -0.006244)" />
        </Pattern>
        
        <Filter id="filter0_d_151_26310" x="3.01953" y="22.6816" width="29.3672" height="17.4453" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="1" />
          <FeGaussianBlur stdDeviation="2" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_151_26310" />
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_151_26310" result="shape" />
        </Filter>
        
        <Filter id="filter1_d_151_26310" x="30.6992" y="25.0176" width="22.6016" height="17.7119" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="1" />
          <FeGaussianBlur stdDeviation="2" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_151_26310" />
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_151_26310" result="shape" />
        </Filter>
        
        <Filter id="filter2_d_151_26310" x="26" y="21" width="10" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="1" />
          <FeGaussianBlur stdDeviation="2" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_151_26310" />
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_151_26310" result="shape" />
        </Filter>
        
        <LinearGradient id="paint0_linear_151_26310" x1="31.2564" y1="22.551" x2="31.412" y2="35.0011" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF7E00" stopOpacity="0.37" />
          <Stop offset="0.36173" stopColor="#FFC387" stopOpacity="0.58" />
          <Stop offset="0.664562" stopColor="#FFD4AB" stopOpacity="0.41" />
          <Stop offset="1" stopColor="#FFC994" stopOpacity="0" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};