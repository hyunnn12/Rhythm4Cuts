// import React, { Component } from 'react';

// export default class OpenViduVideoComponent extends Component {
//     constructor(props) {
//         super(props);
//         // 비디오 요소를 저장할 Ref 생성
//         this.videoRef = React.createRef();
//     }

//     // 컴포넌트가 업데이트될 때 호출되는 메서드
//     componentDidUpdate(prevProps) {
//         // 새로운 스트림 매니저가 전달되었을 때
//         if (this.props.streamManager && this.props.streamManager !== prevProps.streamManager) {
//             // 스트림 매니저에 비디오 요소를 추가
//             this.props.streamManager.addVideoElement(this.videoRef.current);
//         }
//     }

//     // 컴포넌트가 처음 마운트될 때 호출되는 메서드
//     componentDidMount() {
//         // 스트림 매니저와 addVideoElement 메서드가 있는지 확인
//         if (this.props.streamManager && this.props.streamManager.addVideoElement) {
//             // 스트림 매니저에 비디오 요소를 추가
//             this.props.streamManager.addVideoElement(this.videoRef.current);
//         } else {
//             // 오류 출력: addVideoElement 메서드가 스트림 매니저에서 찾아지지 않음
//             console.error('Error: addVideoElement method not found in streamManager');
//         }
//     }

//     render() {
//         return <video autoPlay={true} ref={this.videoRef} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }} />;
//     }
// }

import React, { Component } from "react";

export default class OpenViduVideoComponent extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidUpdate(props) {
    if (props && !!this.videoRef) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  componentDidMount() {
    if (this.props && !!this.videoRef) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  render() {
    return (
      <video
        autoPlay={true}
        ref={this.videoRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "20px",
        }}
      />
    );
  }
}
