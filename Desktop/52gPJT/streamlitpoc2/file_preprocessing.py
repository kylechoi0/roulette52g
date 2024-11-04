import requests
import streamlit as st
import json
import traceback
import PyPDF2
import io

# 별도의 API 키 설정 (전처리 워크플로우용)
PREPROCESS_API_KEY = st.secrets["PREPROCESS_API_KEY"]
PREPROCESS_API_URL = 'https://mir-api.52g.ai/v1/workflows/run'
KNOWLEDGE_API_KEY = st.secrets["KNOWLEDGE_API_KEY"]

# 전역 변수 dataset_id 사용
global dataset_id

def preprocess_files(files, dataset_id):
    headers = {
        'Authorization': f'Bearer {PREPROCESS_API_KEY}',
    }

    try:
        # PDF 파일에서 텍스트 추출
        pdf_file = files[0]
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file.getvalue()))
        
        # 모든 페이지의 텍스트 추출
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() + "\n"
        
        # 워크플로우 실행 요청
        workflow_payload = {
            'response_mode': 'blocking',
            'user': 'user-123',
            'inputs': {
                'text': extracted_text  # 추출된 텍스트를 직접 전달
            },
            'workflow_id': '6a157fa1-8f3d-4bde-8d8c-78df231a724c'
        }
        
        workflow_response = requests.post(
            PREPROCESS_API_URL,
            headers=headers,
            json=workflow_payload,
            timeout=300
        )
        
        # 응답 처리 로직은 동일하게 유지
        if workflow_response.status_code != 200:
            st.error(f"상세 오류 정보:")
            st.error(f"상태 코드: {workflow_response.status_code}")
            st.error(f"헤더: {workflow_response.headers}")
            st.error(f"응답 내용: {workflow_response.text}")

        if workflow_response.status_code == 200:
            result = workflow_response.json()
            file_url = result.get('data', {}).get('outputs', {}).get('result')
            
            # 지식 데이터셋에 URL로 문서 추가
            knowledge_headers = {
                'Authorization': f'Bearer {KNOWLEDGE_API_KEY}',
                'Content-Type': 'application/json'
            }
            
            knowledge_payload = {
                'name': pdf_file.name,
                'text': extracted_text,  # 텍스트 내용 직접 전달
                'indexing_technique': 'high_quality',
                'process_rule': {
                    'mode': 'custom',
                    'rules': {
                        'pre_processing_rules': [
                            {'id': 'remove_extra_spaces', 'enabled': True},
                            {'id': 'remove_urls_emails', 'enabled': True}
                        ],
                        'segmentation': {
                            'separator': '####',
                            'max_tokens': 1000
                        }
                    }
                }
            }
            
            knowledge_response = requests.post(
                f'https://mir-api.52g.ai/v1/datasets/{dataset_id}/document/create_by_text',
                headers=knowledge_headers,
                json=knowledge_payload
            )
            
            # 다운로드 버튼 추가
            if file_url:
                st.markdown("### 전처리된 파일 다운로드")
                # 파일 이름 생성 (원본 파일 이름에 _processed 추가)
                processed_filename = pdf_file.name.rsplit('.', 1)[0] + '_processed.txt'
                
                # 다운로드 버튼
                st.markdown(f'<a href="{file_url}" download="{processed_filename}" target="_blank">📥 전처리된 파일 다운로드</a>', unsafe_allow_html=True)
                
                # 또는 streamlit의 download_button 사용
                response = requests.get(file_url)
                if response.status_code == 200:
                    st.download_button(
                        label="📥 전처리된 파일 다운로드",
                        data=response.content,
                        file_name=processed_filename,
                        mime="text/plain"
                    )
            
            if knowledge_response.status_code == 200:
                st.success("지식 데이터셋에 문서가 추가되었습니다!")
                return knowledge_response.json()
            else:
                st.error(f"지식 데이터셋 추가 실패: {knowledge_response.text}")
                return None
                
        else:
            st.error(f"⚠️ 워크플로우 실행 실패: {workflow_response.status_code}")
            st.error(f"응답 내용: {workflow_response.text}")
            return None

    except Exception as e:
        st.error(f"⚠️ 처리 중 오류 발생: {str(e)}")
        st.error(traceback.format_exc())
        return None
