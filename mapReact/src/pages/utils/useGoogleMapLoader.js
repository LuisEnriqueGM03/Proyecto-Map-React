import { useJsApiLoader } from "@react-google-maps/api";

const useGoogleMapLoader = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBMMbGGDVksjtkj68iJ0sWyTM_2nfb-klg",
        libraries: ["places", "drawing"], 
    });

    return { isLoaded, loadError };
};

export default useGoogleMapLoader;
