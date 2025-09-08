import React from 'react';
import {Button} from 'antd';
import { CodeTwoTone, DeleteTwoTone, EditTwoTone } from '@ant-design/icons';

export default function Icon() {
  return (
    <div className='effectIcon'>
        <Button className='icon icon1' type="link" icon={<DeleteTwoTone />}></Button>
        <Button className='icon icon2' type="link" icon={<CodeTwoTone />}></Button>
        <Button className='icon icon3' type="link" icon={<EditTwoTone />}></Button>
    </div>
  )
}