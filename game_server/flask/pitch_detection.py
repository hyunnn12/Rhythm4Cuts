# import librosa
# import scipy.signal as signal
# import numpy as np
#
# audio_sample, sampling_rate = librosa.load("blueming_iu_vc_cut.wav", sr = None)
# audio_sample1, sampling_rate1 = librosa.load("blueming_child_vc_cut.wav", sr=None)
#
# S = np.abs(librosa.stft(audio_sample, n_fft=1024, hop_length=512, win_length = 1024, window=signal.hann))
# pitches, magnitudes = librosa.piptrack(S=S, sr=sampling_rate)
#
# S1 = np.abs(librosa.stft(audio_sample1, n_fft=1024, hop_length=512, win_length = 1024, window=signal.hann))
# pitches1, magnitudes1 = librosa.piptrack(S=S1, sr=sampling_rate1)
#
# shape = np.shape(pitches)
# nb_samples = shape[0]
# nb_windows = shape[1]
#
# shape1 = np.shape(pitches1)
# nb_samples1 = shape1[0]
# nb_windows1 = shape1[1]
#
# # for i in range(0, nb_windows):
# #     index = magnitudes[:,i].argmax()
# #     pitch = pitches[index,i]
# #     print(pitch)
# diff = 0
#
# for i in range(0, min(nb_windows, nb_windows1)):
#     index = magnitudes[:,i].argmax()
#     pitch = pitches[index,i]
#
#     index1 = magnitudes1[:, i].argmax()
#     pitch1 = pitches1[index1, i]
#
#     diff += abs(pitch-pitch1)
#
# print(diff/min(nb_windows, nb_windows1))