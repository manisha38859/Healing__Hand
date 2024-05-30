import { Button, Col, Form, Input, Row } from "antd";
import React from "react";

function UserForm({ onFinish, initialValues }) {
    return (
        <Form 
            layout='vertical' 
            onFinish={onFinish} 
            initialValues={initialValues}
        >
            <h1 className='card-title mt-3'>User Information</h1>

            <Row gutter={20}>
                <Col span={12} xs={24} sm={24} lg={12}>
                    <Form.Item 
                        required 
                        label='User Name' 
                        name='userName' 
                        rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                        <Input placeholder='User Name' />
                    </Form.Item>
                </Col>
                <Col span={12} xs={24} sm={24} lg={12}>
                    <Form.Item 
                        required 
                        label='User Email' 
                        name='userEmail' 
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input placeholder='User Email' />
                    </Form.Item>
                </Col>
            </Row>

            <div className='d-flex justify-content-end'>
                <Button className='primary-button' htmlType='submit'>SUBMIT</Button>
            </div>
        </Form>
    );
}

export default UserForm;
