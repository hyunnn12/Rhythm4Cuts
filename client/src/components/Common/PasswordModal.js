// import React, { useState } from 'react';
// import { Modal, Box, TextField, Button, Snackbar } from '@mui/material';

// function PasswordModal({ isOpen, handleClose, onPasswordSubmit }) {
//   const [password, setPassword] = useState('');
//   const [showSnackbar, setShowSnackbar] = useState(false);

//   // 비밀번호 입력 변경 처리 함수
//   const handlePasswordChange = (event) => {
//     setPassword(event.target.value);
//   };

//   // 비밀번호 확인 요청 처리 함수
//   const handleSubmit = async () => {
//     const isPasswordCorrect = await checkPassword(password);
//     if (isPasswordCorrect) {
//       onPasswordSubmit(password); // 비밀번호가 맞는 경우, 부모 컴포넌트로 전달
//     } else {
//       setShowSnackbar(true); // 비밀번호가 틀린 경우, 알림 띄우기
//     }
//   };

//   // 비밀번호 확인 결과에 따라 알림 메시지 설정
//   const snackbarMessage = '비밀번호가 틀렸습니다. 다시 확인해주세요.';

//   return (
//     <Modal open={isOpen} onClose={handleClose} aria-labelledby="password-modal">
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           bgcolor: 'white',
//           boxShadow: 24,
//           p: 4,
//           minWidth: 300,
//         }}
//       >
//         <h2>비밀번호 입력</h2>
//         <TextField
//           label="비밀번호"
//           type="password"
//           variant="outlined"
//           value={password}
//           onChange={handlePasswordChange}
//           fullWidth
//         />
//         <Button variant="contained" onClick={handleSubmit} fullWidth>
//           확인
//         </Button>
//       </Box>
//       <Snackbar
//         open={showSnackbar}
//         autoHideDuration={5000}
//         onClose={() => setShowSnackbar(false)}
//         message={snackbarMessage}
//       />
//     </Modal>
//   );
// }

// export default PasswordModal;
