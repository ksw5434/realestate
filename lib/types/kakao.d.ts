// 카카오맵 API 타입 정의
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: MapOptions) => Map;
        services: {
          Geocoder: new () => Geocoder;
          Status: {
            OK: string;
            ZERO_RESULT: string;
            ERROR: string;
          };
        };
        LatLng: new (latitude: number, longitude: number) => LatLng;
        Marker: new (options: MarkerOptions) => Marker;
        InfoWindow: new (options: InfoWindowOptions) => InfoWindow;
        event: {
          addListener: (
            target: any,
            type: string,
            handler: () => void
          ) => void;
        };
      };
    };
  }
}

// 카카오맵 관련 인터페이스
interface MapOptions {
  center: LatLng;
  level: number;
}

interface MarkerOptions {
  position: LatLng;
  map: Map;
}

interface InfoWindowOptions {
  content: string;
}

interface Map {
  setCenter: (latlng: LatLng) => void;
  setLevel: (level: number) => void;
  relayout: () => void;
}

interface Marker {
  setMap: (map: Map | null) => void;
  setPosition: (position: LatLng) => void;
}

interface InfoWindow {
  open: (map: Map, marker: Marker) => void;
  close: () => void;
}

interface LatLng {
  getLat: () => number;
  getLng: () => number;
}

interface Geocoder {
  addressSearch: (
    address: string,
    callback: (result: GeocoderResult[], status: string) => void
  ) => void;
  coord2Address: (
    lng: number,
    lat: number,
    callback: (result: GeocoderResult[], status: string) => void
  ) => void;
}

interface GeocoderResult {
  address_name: string;
  y: string; // 위도
  x: string; // 경도
  address_type: string;
  road_address?: {
    address_name: string;
    building_name: string;
  };
}

export {};

