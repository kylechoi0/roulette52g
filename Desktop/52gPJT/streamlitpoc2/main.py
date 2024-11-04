import streamlit as st
import requests
import json
from datetime import datetime
import uuid
from file_preprocessing import preprocess_files  # Ensure this module is correctly implemented
import traceback

# API URL 정의
API_URL = 'https://mir-api.52g.ai/v1'

# 페이지 설정
st.set_page_config(
    page_title="GS E&R POC #2",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 스타일 시트 정의
st.markdown("""
    <style>
        /* 전체 컨테이너의 상단 여백 조정 */
        .main .block-container {
            padding-top: 2rem !important;
        }

        /* 새 대화 시작 버튼 스타일 */
        .sidebar .stButton > button {
            background-color: #FFC107; /* Yellow theme */
            color: white;
            border: none;
            padding: 0.8rem 1.2rem;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
            display: block !important;  /* 강제로 표시 */
        }

        .sidebar .stButton > button:hover {
            background-color: #FFA000; /* Darker yellow on hover */
            transform: translateY(-2px);
            box-shadow: 0 6px 10px rgba(0,0,0,0.15);
        }

        /* 섹션 제목 스타일 */
        .section-title {
            margin-top: 1.5rem !important;
            margin-bottom: 0.8rem !important;
            font-size: 1.1rem !important;
            font-weight: 700 !important;
            color: #333333 !important;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 0.3rem;
        }

        /* 메뉴 구분선 스타일 */
        .menu-divider {
            border: none !important;
            border-top: 1px solid #e0e0e0 !important;
            margin: 1.5rem 0 !important;
        }

        /* 최근 대화 리스트 스타일 */
        .chat-list-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem !important;
        }

        /* 파일 업로드 섹션 스타일 수정 */
        .upload-section {
            background-color: #ffffff;
            border: 2px dashed #cccccc;
            border-radius: 10px;
            padding: 1.5rem;
            margin: 1rem 0;
            text-align: center;
            transition: all 0.3s ease;
        }

        .upload-section:hover {
            border-color: #FFC107;
            background-color: #fff8e1;
        }

        /* 파일 업로더 컨테이너 스타일 */
        .stFileUploader {
            padding: 1rem;
        }

        /* 파일 업로드 버튼 스타일 */
        .stFileUploader > button {
            width: 100%;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            color: #495057;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .stFileUploader > button:hover {
            background-color: #e9ecef;
            border-color: #adb5bd;
        }

        /* 업로드된 파일 컨테이너 스타일 */
        .uploadedFile {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 0.5rem;
            margin: 0.5rem 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        /* 처리 버튼 스타일 */
        .process-button {
            background-color: #FFC107;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 1rem;
            width: 100%;
        }

        .process-button:hover {
            background-color: #FFA000;
            transform: translateY(-2px);
        }

        /* 파일 정보 텍스트 스타일 */
        .file-info {
            color: #6c757d;
            font-size: 0.85rem;
            margin-top: 0.5rem;
        }

        /* 문서 카드 스타일 */
        .doc-card {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 10px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .doc-card:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }

        .doc-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
            font-size: 0.9rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .doc-info {
            font-size: 0.75rem;
            color: #666;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .doc-status {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 500;
        }

        .status-completed {
            background-color: #e6f3e6;
            color: #2e7d32;
        }

        .status-processing {
            background-color: #fff3e0;
            color: #e65100;
        }

        /* 검색바 스타일 */
        .search-container input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 0.95rem;
            margin-bottom: 0.5rem;
        }

        /* 최근 대화 섹션에 추가된 CSS */
        .chat-item {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            margin: 0.3rem 0;
            border-radius: 8px;
            background-color: #f8f9fa;
            transition: all 0.2s ease;
        }

        .chat-item:hover {
            background-color: #e9ecef;
        }

        .chat-date {
            flex-grow: 1;
            font-size: 0.9em;
            color: #666;
        }

        .chat-actions {
            display: flex;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .chat-item:hover .chat-actions {
            opacity: 1;
        }

        .action-btn {
            background: none;
            border: none;
            color: #666;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 0.9em;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .select-btn:hover {
            color: #2e7d32;
            background-color: #e8f5e9;
        }

        .delete-btn:hover {
            color: #d32f2f;
            background-color: #ffebee;
        }

        /* 버튼 숨기기 (선택, 삭제 버튼만) */
        .chat-item-buttons .stButton {
            display: none !important;
        }
        
        /* 최근 대화 아이템 스타일 */
        .chat-item {
            transition: all 0.2s ease;
        }
        
        .chat-item:hover {
            background-color: #e6e9ef !important;
        }
        
        .delete-btn {
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        .chat-item:hover .delete-btn {
            opacity: 0.6;
        }
        
        .delete-btn:hover {
            opacity: 1 !important;
        }

        /* 버튼 컨테이너 스타일 */
        .stButton {
            height: 30px !important;
        }

        .stButton > button {
            height: 30px !important;
            padding: 0 10px !important;
            font-size: 0.8rem !important;
            line-height: 1 !important;
        }

        /* 선택 버튼 스타일 */
        .select-chat-btn > button {
            background-color: #e8f5e9 !important;
            color: #2e7d32 !important;
            border: 1px solid #2e7d32 !important;
        }

        .select-chat-btn > button:hover {
            background-color: #c8e6c9 !important;
        }

        /* 삭제 버튼 스타일 */
        .delete-chat-btn > button {
            background-color: #ffebee !important;
            color: #d32f2f !important;
            border: 1px solid #d32f2f !important;
        }

        .delete-chat-btn > button:hover {
            background-color: #ffcdd2 !important;
        }

        /* 대화 카드 스타일 수정 */
        .chat-card {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 10px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }

        .chat-card:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transform: translateY(-2px);
            background-color: #f8f9fa;
        }

        .chat-info {
            flex-grow: 1;
        }

        .chat-date {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
            font-size: 0.9rem;
        }

        .chat-status {
            font-size: 0.75rem;
            color: #666;
        }

        .delete-icon {
            color: #d32f2f;
            opacity: 0.6;
            font-size: 1rem;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .delete-icon:hover {
            opacity: 1;
            background-color: #ffebee;
        }

        .chat-buttons {
            display: flex;
            gap: 8px;
        }

        .chat-buttons .stButton > button {
            min-height: 32px !important;
            padding: 0 12px !important;
            font-size: 0.85rem !important;
            border-radius: 6px !important;
        }

        .select-btn > button {
            background-color: #e8f5e9 !important;
            color: #2e7d32 !important;
            border: 1px solid #2e7d32 !important;
        }

        .select-btn > button:hover {
            background-color: #c8e6c9 !important;
        }

        .delete-btn > button {
            background-color: #ffebee !important;
            color: #d32f2f !important;
            border: 1px solid #d32f2f !important;
        }

        .delete-btn > button:hover {
            background-color: #ffcdd2 !important;
        }
        /* 파일 업로더 스타일 */
        .stFileUploader {
            padding: 1rem;
            margin: 1rem 0;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        /* 파일 업로더 버튼 스타일 */
        .stFileUploader > button {
            width: 100%;
            color: #495057;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            cursor: pointer;
        }

        /* 파일 업로더 버튼 호버 스타일 */
        .stFileUploader > button:hover {
            background-color: #e9ecef;
            border-color: #adb5bd;
        }
    </style>
""", unsafe_allow_html=True)

# 초기 세션 상태 설정
if 'dataset_id' not in st.session_state:
    try:
        st.session_state.dataset_id = st.secrets["DATASET_ID"]
    except KeyError:
        st.error('⚠️ Dataset ID가 설정되어 있지 않습니다.')
        st.stop()

if 'api_key' not in st.session_state:
    try:
        st.session_state.api_key = st.secrets["API_KEY"]
    except KeyError:
        st.error('⚠️ API 키가 설정되어 있지 않습니다.')
        st.stop()

if 'conversations' not in st.session_state:
    st.session_state.conversations = {}

if 'recent_chats' not in st.session_state:
    st.session_state.recent_chats = []

if 'conversation_id' not in st.session_state:
    # 기존 대화가 있으면 가장 최근 대화로 설정, 없으면 새로운 대화 생성
    if st.session_state.recent_chats:
        st.session_state.conversation_id = st.session_state.recent_chats[0]['id']
    else:
        new_chat_id = str(uuid.uuid4())
        st.session_state.conversation_id = new_chat_id
        st.session_state.conversations[new_chat_id] = []
        st.session_state.recent_chats.insert(0, {
            'id': new_chat_id,
            'title': "새 대화",
            'date': datetime.now().strftime('%Y-%m-%d'),
            'messages': []
        })

# 사이드바 구성
with st.sidebar:
    # 제목 추가
    st.markdown("""
        <div style='margin-bottom: 1rem;'>
            <p style='font-size: 0.9rem; color: #666; text-align: center;'>
                GS E&R POC #2 프로토타입<br>(설비 Manual Agent)
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    # 새 대화 버튼
    if st.button("✨ 새 대화 시작하기", key="new_chat", help="새 대화를 시작합니다."):
        new_chat_id = str(uuid.uuid4())
        new_chat = {
            'id': new_chat_id,
            'title': "새 대화",
            'date': datetime.now().strftime('%Y-%m-%d'),
            'messages': []
        }
        st.session_state.recent_chats.insert(0, new_chat)
        st.session_state.conversation_id = new_chat_id
        st.session_state.conversations[new_chat_id] = []
        st.rerun()

    # 사업장 선택 섹션
    st.markdown('<div class="section-title">🏭 사업장 선택</div>', unsafe_allow_html=True)
    selected_plant = st.radio(
        label="사업장을 선택하세요",
        options=["GS반월열병합발전", "GS구미열병합발전", "GS동해전력", "GS포천그린에너지"],
        label_visibility="collapsed"
    )

    # 최근 대화 섹션
    st.markdown('<div class="section-title">💬 최근 대화</div>', unsafe_allow_html=True)
    if not st.session_state.recent_chats:
        st.write("최근 대화가 없습니다.")
    else:
        for chat in st.session_state.recent_chats[:5]:
            chat_id = chat['id']
            chat_date = chat.get('date', '')
            is_selected = st.session_state.conversation_id == chat_id
            
            # 선택 버튼과 삭제 버튼을 별도로 생성
            col1, col2 = st.columns([4, 1])
            with col1:
                if st.button(f"✅ {chat_date} ({len(st.session_state.conversations.get(chat_id, []))} 메시지)", 
                            key=f"select_{chat_id}",
                            use_container_width=True):
                    st.session_state.conversation_id = chat_id
                    st.rerun()
            
            with col2:
                if st.button("❌", key=f"delete_{chat_id}"):
                    st.session_state.recent_chats = [c for c in st.session_state.recent_chats if c['id'] != chat_id]
                    if chat_id in st.session_state.conversations:
                        del st.session_state.conversations[chat_id]
                    if st.session_state.conversation_id == chat_id:
                        if st.session_state.recent_chats:
                            st.session_state.conversation_id = st.session_state.recent_chats[0]['id']
                        else:
                            new_chat_id = str(uuid.uuid4())
                            st.session_state.conversation_id = new_chat_id
                            st.session_state.conversations[new_chat_id] = []
                            st.session_state.recent_chats.insert(0, {
                                'id': new_chat_id,
                                'title': "새 대화",
                                'date': datetime.now().strftime('%Y-%m-%d'),
                                'messages': []
                            })
                    st.rerun()

    # 파일 업로드 섹션 수정
    st.markdown('<div class="section-title">📁 파일 업로드</div>', unsafe_allow_html=True)

    with st.container():
        uploaded_files = st.file_uploader(
            "Manual과 같은 문자 형식의 도면만 가능",
            type=['pdf'],
            accept_multiple_files=True,
            help="PDF 파일만 업로드 가능합니다. (최대 50MB)"
        )

        if uploaded_files:
            total_size = sum([file.size for file in uploaded_files])
            files_count = len(uploaded_files)

            # 파일 크기 검증
            invalid_files = [file.name for file in uploaded_files if file.size > 50 * 1024 * 1024]

            if invalid_files:
                st.warning(f"⚠️ 다음 파일이 50MB를 초과합니다:\n" + "\n".join(invalid_files))
            else:
                st.markdown(f"""
                    <div class="file-info">
                        📎 {files_count}개 파일 선택됨 | 💾 총 {total_size / (1024*1024):.1f}MB
                    </div>
                """, unsafe_allow_html=True)

                if st.button("파일 처리 시작", key="process_button", help="선택한 파일들을 처리합니다"):
                    with st.spinner("처리 중..."):
                        try:
                            result_link = preprocess_files(uploaded_files, st.session_state.dataset_id)
                            if result_link:
                                st.success("✅ 처리 완료!")
                                st.markdown(f"[📥 결과 다운로드]({result_link})")
                            else:
                                st.error("❌ 처리 실패")
                        except Exception as e:
                            st.error(f"❌ 오류 발생: {str(e)}")

    # 저장 문서 섹션
    st.markdown('<div class="section-title">📚 저장된 문서</div>', unsafe_allow_html=True)

    # 검색바 추가
    search_query = st.text_input("", placeholder="문서 검색...", label_visibility="collapsed")

    try:
        headers = {
            'Authorization': f'Bearer {st.secrets["KNOWLEDGE_API_KEY"]}',
            'Content-Type': 'application/json'
        }

        response = requests.get(
            f'{API_URL}/datasets/{st.session_state.dataset_id}/documents',
            headers=headers,
            params={'page': 1, 'limit': 1000}
        )

        if response.status_code == 200:
            doc_list = response.json()
            sorted_docs = sorted(doc_list['data'], key=lambda x: x['created_at'], reverse=True)

            # 검색 필터링
            if search_query:
                sorted_docs = [doc for doc in sorted_docs if search_query.lower() in doc['name'].lower()]

            for doc in sorted_docs:
                status = "completed" if doc['indexing_status'] == 'completed' else "processing"
                status_text = "완료" if status == "completed" else "처리 중"
                status_class = "status-completed" if status == "completed" else "status-processing"
                created_at = datetime.fromtimestamp(doc['created_at']).strftime('%Y-%m-%d %H:%M')

                st.markdown(f"""
                    <div class="doc-card">
                        <div class="doc-title">{doc['name'][:50]}</div>
                        <div class="doc-info">
                            <span>{created_at} • {doc.get('word_count', 0):,}자</span>
                            <span class="doc-status {status_class}">{status_text}</span>
                        </div>
                    </div>
                """, unsafe_allow_html=True)

    except Exception as e:
        st.error(f"오류 발생: {str(e)}")

# 메인 화면에 대화 내용 표시
if st.session_state.conversation_id in st.session_state.conversations:
    for message in st.session_state.conversations[st.session_state.conversation_id]:
        with st.chat_message(message['role']):
            st.markdown(message['message'])
            timestamp = message.get('timestamp', datetime.now().strftime('%Y-%m-%d %H:%M'))
            st.markdown(f"<div style='text-align: right; color: gray; font-size: 0.8em;'>{timestamp}</div>", unsafe_allow_html=True)

# 자동 스크롤 위한 요소 추가
st.markdown('<div id="chat-end"></div>', unsafe_allow_html=True)
st.markdown("""
<script>
var chatEnd = document.getElementById('chat-end');
if (chatEnd) {
    chatEnd.scrollIntoView({behavior: 'smooth'});
}
</script>
""", unsafe_allow_html=True)

# 사용자 입력 받기
if prompt := st.chat_input("메시지를 입력하세요... (Enter를 눌러 전송)"):
    # conversation_id가 유효한지 확인
    if st.session_state.conversation_id not in st.session_state.conversations:
        # 유효하지 않으면 새로운 대화 생성
        new_chat_id = str(uuid.uuid4())
        st.session_state.conversation_id = new_chat_id
        st.session_state.conversations[new_chat_id] = []
        st.session_state.recent_chats.insert(0, {
            'id': new_chat_id,
            'title': "새 대화",
            'date': datetime.now().strftime('%Y-%m-%d'),
            'messages': []
        })

    # 사용자 메시지 표시 및 저장
    with st.chat_message("user"):
        st.markdown(prompt)
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
        st.markdown(f"<div style='text-align: right; color: gray; font-size: 0.8em;'>{timestamp}</div>", unsafe_allow_html=True)

    st.session_state.conversations[st.session_state.conversation_id].append({
        'role': 'user',
        'message': prompt,
        'timestamp': timestamp
    })

    # API 요청 부분
    with st.chat_message("assistant"):
        assistant_placeholder = st.empty()
        answer = ''

        with st.spinner("답변을 생성 중입니다..."):
            headers = {
                'Authorization': f'Bearer {st.session_state.api_key}',
                'Content-Type': 'application/json',
            }

            data = {
                'query': prompt,
                'response_mode': 'streaming',
                'user': 'user-' + st.session_state.get('user_id', '123'),
                'inputs': {},
                'dataset_id': st.session_state.dataset_id
            }

            try:
                response = requests.post(
                    f'{API_URL}/chat-messages',
                    headers=headers,
                    json=data,
                    stream=True
                )

                if response.status_code == 200:
                    for line in response.iter_lines():
                        if line:
                            event_data = line.decode('utf-8')
                            if event_data.startswith('data:'):
                                json_data = event_data[5:].strip()
                                try:
                                    event_json = json.loads(json_data)
                                    event = event_json.get('event')

                                    if event in ['message', 'agent_message']:
                                        answer += event_json.get('answer', '')
                                        assistant_placeholder.markdown(answer)
                                    elif event == 'message_end':
                                        st.session_state.conversations[st.session_state.conversation_id].append({
                                            'role': 'assistant',
                                            'message': answer,
                                            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M')
                                        })
                                        break
                                except json.JSONDecodeError:
                                    continue
                else:
                    st.error(f"⚠️ API 요청 실패: {response.status_code}")
            except Exception as e:
                st.error(f"⚠️ 오류 발생: {str(e)}")
                st.write(f"Error details: {traceback.format_exc()}")
