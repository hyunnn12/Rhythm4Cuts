# from game_server.flask.splitter import portion_splitter
# import pymysql
#
# # MySQL database properties
# host = 'i9b109.p.ssafy.io'
# user = '9ithubB109_simons'
# password = 'zlwhsalsrnrWid7991'
# db = 'rhythm'
# charset = 'utf8'
#
# # Establishing a connection
# conn = pymysql.connect(
#     host=host,
#     user=user,
#     password=password,
#     db=db,
#     charset=charset
# )
#
# cursor = conn.cursor()
# cursor.execute("select * from lyrics where song_seq = 119 order by lyrics_seq")
# lyrics_arr = cursor.fetchall()
#
# for i in range(len(lyrics_arr)):
#     lyrics_seq, end_time, lyric, song_order, start_time, song_seq = lyrics_arr[i]
#
#     # 게임시퀀스(디렉토리), 파일명(디렉토리/파일명), 시작 시간, 끝 시간
#     # 생성되는 파일명 => 1~n.wav (순서 번호.wav)
#     # !!!파일명은 1번부터 시작함!!!
#     portion_splitter(str(0), "./flask/output/red_sun/vocals.wav", str(i + 1), start_time, end_time)