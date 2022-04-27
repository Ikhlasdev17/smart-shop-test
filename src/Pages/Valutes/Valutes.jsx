import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { URL, setToken } from '../../assets/api/URL'
import { Button, Drawer, Skeleton, Table } from 'antd';
import Content from './Content';

import './Valutes.scss'

import { useTranslation } from 'react-i18next';

const Valutes = () => {
    const [loading, setLoading] = useState(false)
    const [valutes, setValutes] = useState([])
    const [open, setOpen] = useState(false)
    const [currentValute, setCurrentValute] = useState({})
    const [changed, setChanged] = useState(false)
    const {t} = useTranslation()


    useEffect(() => {
        axios.get(`${URL}/api/currency`, setToken())
        .then(res => {
            setValutes(res.data.payload)
        })
    }, [changed])


    const dataSource = [];


    valutes.map(item => {
        item.rate.length > 0 && 
        dataSource.push({
            key: item.id,
            valute: <><strong>{item.code}</strong> = <strong>{item.rate.length > 0 && item.rate.map(item => item.code)}</strong></>,
            rate: <><strong>{item.rate.map(item => item.rate).toLocaleString()} {item.rate.length > 0 && item.rate.map(item => item.code)}</strong></>,
            descr: <></>,
            action: <>
            <div className="table-button__group">

                <Button className="" onClick={() => {
                    setOpen(!open)
                    setCurrentValute(item)
                    // setModalType('update')
                    // setCurrentProduct(item)
                }}><i className="bx bx-edit"></i></Button>
                <Button className=""><i className="bx bx-trash"></i></Button>
                </div>
            </>
        })
    })


    const columns = [
        {key: 'key',dataIndex: 'valute',title: t('valuta_juftligi')},
        {key: 'valute',dataIndex: 'rate',title: t('kurs')},
        {key: 'rate',dataIndex: 'descr',title: t('description')},
        {key: 'descr',dataIndex: 'action',title: t('action')}
    ]

  return ( 

        <div className="section products-page">

        <Drawer title={t('valyuta_qosiw')} visible={open} onClose={() => setOpen(false)}>
        <Content currentValute={currentValute} setOpen={() => setOpen()} setChanged={() =>setChanged()} changed={changed} />
        </Drawer>

        <h1 className="heading">{t('valyutalar')}</h1>

        <div className="content">
            <div className="content-top">     
            <Button className="btn btn-primary btn-md" onClick={() => {
            setOpen(true)
            // setModalType('add')
            }}><i className="bx bx-plus"></i> {t('valyuta_qosiw')}</Button>
            </div>


            <div className="content-body" >
            <Skeleton loading={loading} active avatar rows={15} width="100%" block>
            <Table size="medium" rowClassName={"table-row"} className="content-table" width="100%"  dataSource={dataSource} columns={columns} />
            </Skeleton>
            </div>
        </div>
        </div>
  )
}

export default Valutes
