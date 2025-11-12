import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление путевыми листами FleetPro
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с путевыми листами или результатом операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            waybill_id = query_params.get('id')
            
            if waybill_id:
                cur.execute('SELECT * FROM waybills WHERE id = %s', (waybill_id,))
                data = cur.fetchone()
            else:
                cur.execute('SELECT * FROM waybills ORDER BY issue_date DESC')
                data = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(data, default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            waybill_number = body_data.get('waybill_number')
            if not waybill_number:
                today = datetime.now().strftime('%Y%m%d')
                cur.execute("SELECT COUNT(*) as count FROM waybills WHERE issue_date = CURRENT_DATE")
                count_row = cur.fetchone()
                count = count_row['count'] if count_row else 0
                waybill_number = f"ПЛ-{today}-{count + 1:03d}"
            
            cur.execute(
                """INSERT INTO waybills (waybill_number, route_id, vehicle_number, driver_name, 
                   issue_date, mileage_start, fuel_start, status) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (waybill_number, body_data.get('route_id'), body_data['vehicle_number'], 
                 body_data['driver_name'], body_data.get('issue_date', datetime.now().date()),
                 body_data.get('mileage_start'), body_data.get('fuel_start'), 'issued')
            )
            
            conn.commit()
            result = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            waybill_id = body_data.get('id')
            
            if not waybill_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'ID required'})
                }
            
            cur.execute(
                """UPDATE waybills SET mileage_end = %s, fuel_end = %s, status = %s 
                   WHERE id = %s RETURNING *""",
                (body_data.get('mileage_end'), body_data.get('fuel_end'), 
                 body_data.get('status', 'closed'), waybill_id)
            )
            
            conn.commit()
            result = cur.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(result, default=str)
            }
    
    finally:
        cur.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }