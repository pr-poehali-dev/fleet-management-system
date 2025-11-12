import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления автопарком FleetPro
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response dict с данными из БД
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    query_params = event.get('queryStringParameters', {}) or {}
    entity = query_params.get('entity', '')
    
    try:
        if method == 'GET':
            if entity == 'vehicles':
                cur.execute('SELECT * FROM vehicles ORDER BY id')
                data = cur.fetchall()
            elif entity == 'drivers':
                cur.execute('SELECT * FROM drivers ORDER BY id')
                data = cur.fetchall()
            elif entity == 'requests':
                cur.execute('SELECT * FROM requests ORDER BY id')
                data = cur.fetchall()
            elif entity == 'routes':
                cur.execute('SELECT * FROM routes ORDER BY id')
                data = cur.fetchall()
            elif entity == 'stats':
                cur.execute('''
                    SELECT 
                        (SELECT COUNT(*) FROM vehicles WHERE status = 'active') as active_vehicles,
                        (SELECT COUNT(*) FROM routes WHERE status = 'active') as active_routes,
                        (SELECT COUNT(*) FROM requests WHERE status = 'pending') as pending_requests,
                        (SELECT COALESCE(SUM(fuel_liters), 0) FROM routes WHERE status = 'active') as total_fuel
                ''')
                data = cur.fetchone()
            else:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Entity not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(data, default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if entity == 'vehicles':
                cur.execute(
                    "INSERT INTO vehicles (number, model, status) VALUES (%s, %s, %s) RETURNING *",
                    (body_data['number'], body_data['model'], body_data.get('status', 'idle'))
                )
            elif entity == 'drivers':
                cur.execute(
                    "INSERT INTO drivers (name, license, vehicle_number, status) VALUES (%s, %s, %s, %s) RETURNING *",
                    (body_data['name'], body_data['license'], body_data.get('vehicle_number'), body_data.get('status', 'available'))
                )
            elif entity == 'requests':
                cur.execute(
                    """INSERT INTO requests (date, from_address, to_address, status, priority, 
                       cargo_type, cargo_weight_kg, passengers_count, required_vehicle_type) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                    (body_data['date'], body_data['from_address'], body_data['to_address'], 
                     body_data.get('status', 'pending'), body_data.get('priority', 'medium'),
                     body_data.get('cargo_type'), body_data.get('cargo_weight_kg'),
                     body_data.get('passengers_count'), body_data.get('required_vehicle_type'))
                )
            elif entity == 'routes':
                cur.execute(
                    """INSERT INTO routes (vehicle_number, driver_name, distance_km, fuel_liters, status, 
                       request_id, waybill_number) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                    (body_data['vehicle_number'], body_data['driver_name'], 
                     body_data.get('distance_km', 0), body_data.get('fuel_liters', 0), 
                     body_data.get('status', 'planned'), body_data.get('request_id'),
                     body_data.get('waybill_number'))
                )
            else:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Entity not found'})
                }
            
            conn.commit()
            result = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            record_id = body_data.get('id')
            
            if not record_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID required'})
                }
            
            if entity == 'vehicles':
                cur.execute(
                    "UPDATE vehicles SET status = %s WHERE id = %s RETURNING *",
                    (body_data.get('status'), record_id)
                )
            elif entity == 'drivers':
                cur.execute(
                    "UPDATE drivers SET status = %s, vehicle_number = %s WHERE id = %s RETURNING *",
                    (body_data.get('status'), body_data.get('vehicle_number'), record_id)
                )
            elif entity == 'requests':
                cur.execute(
                    "UPDATE requests SET status = %s WHERE id = %s RETURNING *",
                    (body_data.get('status'), record_id)
                )
            elif entity == 'routes':
                cur.execute(
                    "UPDATE routes SET status = %s WHERE id = %s RETURNING *",
                    (body_data.get('status'), record_id)
                )
            
            conn.commit()
            result = cur.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str)
            }
    
    finally:
        cur.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }