import { type AppType } from "next/app";
import { api } from "y/utils/api";
import "y/styles/globals.css";
import "y/components/map/map.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { ChakraProvider } from "@chakra-ui/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Component {...pageProps} />;
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
