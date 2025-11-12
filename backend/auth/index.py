import json
import hashlib
import os
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash

def generate_token(user_id: int, username: str, role: str) -> str:
    timestamp = datetime.now().isoformat()
    token_data = f"{user_id}:{username}:{role}:{timestamp}"
    return hashlib.sha256(token_data.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Аутентификация пользователей FleetPro (Водитель/Диспетчер)
    Args: event с httpMethod, body (username, password для login; token для verify)
    Returns: HTTP response с токеном и ролью или ошибкой
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action', 'login')
        
        if action == 'login':
            username = body_data.get('username', '')
            password = body_data.get('password', '')
            
            if not username or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Username and password required'})
                }
            
            import psycopg2
            dsn = os.environ.get('DATABASE_URL')
            
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            
            cur.execute(
                "SELECT id, username, password_hash, role, full_name FROM users WHERE username = %s",
                (username,)
            )
            user_row = cur.fetchone()
            
            cur.close()
            conn.close()
            
            if not user_row:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid credentials'})
                }
            
            user_id, db_username, password_hash, role, full_name = user_row
            
            if not verify_password(password, password_hash):
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid credentials'})
                }
            
            token = generate_token(user_id, db_username, role)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user_id,
                        'username': db_username,
                        'role': role,
                        'full_name': full_name
                    }
                })
            }
        
        elif action == 'verify':
            token = body_data.get('token', '')
            
            if not token:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Token required'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'valid': True})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }