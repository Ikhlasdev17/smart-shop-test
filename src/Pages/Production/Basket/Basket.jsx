import {
  Select,
  DatePicker,
  Table,
  Skeleton,
  Button,
  Drawer,
  Modal,
  Tag,
} from "antd";
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

const ProductionBasket = () => {
  const dispatch = useDispatch();
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modaltype, setModaltype] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [basketOrders, setBasketOrders] = useState([]);
 
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
        fetch(`${URL}/api/production/finshed/${id}`, {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem('token')
            }
        })
          .then((res) => {
            setRefresh(!refresh);
            Swal.fire({
              title: t("deleted"),
              icon: "success",
              confirmButtonText: t("OK"),
            });
          })
          .catch((res) => {
            Swal.fire({
              title: t("notdeleted"),
              icon: "info",
              confirmButtonText: t("OK"),
            });
          });
      }
    });
    
  };

  // FETCHING INGREDIENTS
  useEffect(async () => {
    setLoading(true);

    const response = await axios.get(
      `${URL}/api/production/baskets`,
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
      deadline: moment(item?.deadline).format("DD MMM, YYYY"),
      actions: (
        <div className="table-button__group">
          <Button
            className="table-btn"
            onClick={() => deleteBasket(item?.basket_id)}
          >
            <i className="bx bx-trash"></i>
          </Button>
        </div>
      ),
    });
  });

  // TABLE HEADERS
  const columns = [
    {
      title: t("toplam"),
      dataIndex: "count",
      key: "key",
      width: "100px",
    },
    {
      title: t("date"),
      dataIndex: "deadline",
      key: "key",
      width: '70%'
    },
    {
      title: t("action"),
      dataIndex: "actions",
      key: "key",
    },
  ];

  // GET BASKET ORDERS
  const getBasketOrders = (id) => {
    axios
      .get(`${URL}/api/production/orders/${id}`, setToken())
      .then((res) => {
        setBasketOrders(res.data.payload);
      })
      .finally(() => setLoading(false));
  };

  // MAIN RETURN
  return (
    <div className="section main-page">
      <h1 className="heading">{t("production__process")}</h1>
      <Modal
        width={780}
        visible={modalIsOpen}
        footer={null}
        onCancel={() => {
          setModalIsOpen(false);
          setBasketOrders([]);
        }}
        title={t("ishlab_chiqarish")}
      >
        <div className="h-500 overlfow-y-auto">
          {basketOrders?.map((item) => (
            <Skeleton loading={loading}>
              <table className="info-table">
                {/* HEAD */}
                <thead className="info-table__head">
                  <td className="info-table__th">
                    <b>{item?.product_name}</b>{" "}
                  </td>
                  <td className="info-table__th">
                    <b>
                      {t("count")} {item?.count}{" "}
                    </b>
                  </td>
                </thead>
                {/* BODY */}
                <tbody className="info-table__body">
                  {item?.ingredients?.map((ingredient) => (
                    <tr className="info-table__row">
                      <td className="info-table__td">
                        {ingredient?.ingredient_name}
                      </td>
                      <td className="info-table__td">{ingredient?.count}</td>
                      {ingredient?.ordered_at !== null ? (
                        <td className="info-table__td">
                          {moment(ingredient?.ordered_at).format(
                            "DD MMM, YYYY"
                          )}
                        </td>
                      ) : (
                        <td className="info-table__td"></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Skeleton>
          ))}
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
              rowClassName="cursor-pointer"
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
                      setLoading(true);
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
                        className="responsive__table-item justify-between"
                        key={index}
                      >
                        <div className="responsive__table-item__details-name">
                          <h3>{item?.basket_id}</h3>
                        </div>
                        <div>
                          <div className="responsive__table-item__details-count">
                            <h3>
                              {moment(item?.deadline).format("DD MMM, YYYY")}
                            </h3>
                            <span></span>
                          </div>
                        </div>
                          <div className="table-button__group">
                            <Button
                                className="table-btn"
                                onClick={() => deleteBasket(item?.basket_id)}
                            >
                                <i className="bx bx-trash"></i>
                            </Button>
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

export default ProductionBasket;
