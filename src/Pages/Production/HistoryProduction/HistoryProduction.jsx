import { Select, DatePicker, Table, Skeleton, Button, Drawer, Modal, Tag } from "antd";
import React, { useState, useEffect } from "react";
import ModalAction from "../../../components/ModalAction/ModalAction";

import axios from "axios";
import {
  fetchingProducts,
  fetchedProducts,
} from "../../../redux/productsSlice";

import { useDispatch, useSelector } from "react-redux";

import { setToken, URL } from "../../../assets/api/URL";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import moment from "moment";

import { useTranslation } from "react-i18next"; 
import Swal from "sweetalert2";

const { RangePicker } = DatePicker;
const { Option } = Select;

const HistoryProduction = () => {
  const dispatch = useDispatch();
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modaltype, setModaltype] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [basketOrders, setBasketOrders] = useState([])

  // MODAL TABLE COLUMNS
  const selectedItemColumns = [
    {
      title: t("count"),
      dataIndex: "product",
      key: "key",
    },
    {
      title: t("USD"),
      dataIndex: "usd",
      key: "key",
    },
    {
      title: t("date"),
      dataIndex: "date",
      key: "key",
    },
  ];

  // UNIT ITEMS
  const unit_id_options = [
    { id: 1, label: t("dona") },
    { id: 2, label: t("tonna") },
    { id: 3, label: t("kilogram") },
    { id: 4, label: t("gramm") },
    { id: 5, label: t("meter") },
    { id: 6, label: t("sm") },
    { id: 7, label: t("liter") },
  ];

  // DELETE ITEM
  const deleteBasket = (id) => {
    Swal.fire({
      title: t("delete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("no"),
      confirmButtonText: t("yes"),
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`${URL}/api/production/finshed/${id}`, setToken()).then((res) => {
          setRefresh(!refresh);
          Swal.fire({
            title: t("deleted"),
            icon: "success",
            confirmButtonText: t("OK"),
          });
        }).catch(res => {
            Swal.fire({
              title: t("notdeleted"),
              icon: "info",
              confirmButtonText: t("OK"),
            });
        })
      }
    });
  };

  // FETCHING INGREDIENTS
  useEffect(async () => {
    setLoading(true);

    const response = await axios.get(
      `${URL}/api/production/histories`,
      setToken()
    );

    if (response.status === 200) {
      setBaskets(response.data.payload.data);
      setLoading(false);
    }
  }, [refresh]);

  const dataSource = [];

  // TABLE DATA
  baskets?.map((item) => {
    dataSource.push({
      key: item?.basket_id,
      count: item?.basket_id,
      deadline: item?.deadline?.length > 10 ? moment(item?.deadline).format('DD MMM, YYYY') : item?.deadline, 
      
    });
  });

  // TABLE HEADERS
  const columns = [
    {
      title: t("toplam"),
      dataIndex: "count",
      key: "key",
      width: '100px'
    },
    {
      title: t("date"),
      dataIndex: "deadline",
      key: "key",
    }
  ];


  // GET BASKET ORDERS
  const getBasketOrders = (id) => {
    axios.get(`${URL}/api/production/orders/${id}`, setToken())
    .then(res => {
        setBasketOrders(res.data.payload)
    }).finally(() => setLoading(false))
  }   



  // MAIN RETURN
  return (
    <div className="section main-page">
      <h1 className="heading">{t("production__history")}</h1>
      <Modal
            width={780}
            visible={modalIsOpen}
            footer={null}
            onCancel={() => {
                setModalIsOpen(false);
                setBasketOrders([]);
            }}
            title={t('ishlab_chiqarish')}  
          > 
            <div className="h-500 overlfow-y-auto">
            {
              basketOrders?.map(item => (
                <Skeleton loading={loading}>
                    <table className="info-table">
                  {/* HEAD */}
                  <thead className="info-table__head">
                    <td className="info-table__th">
                      <b>{item?.product_name}</b> {" "}{" "}{" "} 
                    </td>
                    <td className="info-table__th">
                      <b>{t('count')} {item?.count} </b> 
                    </td> 
                  </thead>
                  {/* BODY */}
                  <tbody className="info-table__body">
                    {
                      item?.ingredients?.map(ingredient => (
                        <tr className="info-table__row">
                          <td className="info-table__td">
                            {ingredient?.ingredient_name}
                          </td>
                          <td className="info-table__td">
                            {ingredient?.count}
                          </td>
                          {
                            ingredient?.ordered_at !== null ? (
                              <td className="info-table__td">
                                {moment(ingredient?.ordered_at).format('DD MMM, YYYY')}
                              </td>
                            ) : (
                              <td className="info-table__td"></td>
                            )
                          } 
                          
                        </tr>
                      ))
                    }
              
                  </tbody>
                </table>
                </Skeleton>
              ))
            }
            </div>
        </Modal> 
      <div className="content">
        <div className="content-top"> 
        </div>

        <div className="content-body">
          <Skeleton loading={loading} active>
            <Table
              className="content-table lg-table"
              dataSource={dataSource}
              columns={columns}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    if (
                      event.target.classList[0] !== "table-btn" &&
                      event.target.classList[0] !== "bx" &&
                      event.target.classList[0] !== "ant-btn"
                    ) {
                      setModaltype("history");
                      setModalIsOpen(!modalIsOpen);
                      getBasketOrders(record.key);
                      setLoading(true)
                    }
                  },
                };
              }}
            />

            <div className="responsive__table">
              {baskets && baskets.length > 0
                ? baskets.map((item, index) => {
                    return (
                      <div
                        className="responsive__table-item justify-between cursor-pointer"
                        key={index}
                        onClick={ (event) => {
                            if (
                              event.target.classList[0] !== "table-btn" &&
                              event.target.classList[0] !== "bx" &&
                              event.target.classList[0] !== "ant-btn"
                            ) {
                              setModaltype("history");
                              setModalIsOpen(!modalIsOpen);
                              getBasketOrders(item?.basket_id);
                              setLoading(true)
                            }
                          }}
                      >
                        <div className="responsive__table-item__details-name">
                          <h3>{item?.basket_id}</h3>
                        </div>

                        <div className="responsive__table-item__details-count">
                          <h3>{item?.deadline?.length > 10 ? moment(item?.deadline).format('DD MMM, YYYY') : item?.deadline}</h3>
                          <span>
                            
                          </span>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export default HistoryProduction;
