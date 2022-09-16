import {
  Collapse,
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
  const [products, setProducts] = useState([])
  const [ingredients, setIngredients] = useState([])

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
      title: t("process__end"),
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
              title: t("muaffaqiyatli"),
              icon: "success",
              confirmButtonText: t("OK"),
            });
          })
          .catch((res) => {
            Swal.fire({
              title: t("xatolik"),
              icon: "info",
              confirmButtonText: t("OK"),
            });
          });
      }
    });
    
  };

  useEffect(async () => {
    setLoading(true);

    const response = await axios.get(
      `${URL}/api/products/ingredient`,
      setToken()
    );
    setLoading(true);

    if (response.status === 200) {
      setProducts(response.data.payload.data);
      setLoading(false); 
    }

    const res2 = await axios.get(`${URL}/api/ingredients`, setToken());
    if (res2.status === 200) {
      setIngredients(res2.data.payload)
    }
  }, []);

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
        console.info(res.data)
      })
      .finally(() => setLoading(false));
  };

  
  // getTotalSum
  const getTotalSum = (arr) => {
    let ourPrice = [];
    arr?.map((item) => {
      ourPrice.push(item?.price * item?.count);
    });

    let totalSum = ourPrice.reduce((prev, current) => prev + current, 0);

    return totalSum.toLocaleString();
  };
 

  // get total ingredient count price
  const getIngredientCountPrice = (item) => {
    return (item?.count * item?.price).toLocaleString();
  };

  console.info(basketOrders)
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
            <Collapse className="calculator-info">
              {basketOrders?.map((item, index) => (
                <Collapse.Panel
                  header={
                    <div className="calculator-info__header">
                      <td className="info-table__th">
                        <b className="capitalize">
                          {
                            products?.find((x) => x?.id === item?.product_id)
                              ?.category?.name
                          }
                        </b>{" "}
                      </td>
                      <td className="info-table__th">
                        <b className="capitalize">{item?.product_name}</b>{" "}
                      </td>  
                      <td className="info-table__th">
                        <b>{t("total_price")}: </b>
                        <span>{getTotalSum(item?.ingredients)}</span>{" "}
                      </td>
                      <td className="info-table__th">
                        <b>{t("count")} </b>
                        <span>{item?.count}</span>
                        {/* <Button
                          type="link"
                          danger
                          onClick={() => {
                            deleteFromSelected(item?.product_id);
                            Swal.fire({
                              title: t("deleted"),
                              icon: "success",
                            });
                          }}
                        >
                          <i className="bx bx-trash"></i>
                        </Button> */}
                      </td>
                    </div>
                  }
                  key={index}
                >
                  {item?.ingredients?.map((ingredient) => (
                    <tr className="info-table__row">
                      <td className="info-table__td">
                        {ingredient?.ingredient_name}
                      </td>
                      <td className="info-table__td">
                        {ingredient?.count}{" "}
                        <b>{unit_id_options?.find(x => x?.id === ingredients?.find(item => item.name === ingredient?.ingredient_name)?.unit_id)?.label}</b>
                      </td>
                      <td className="info-table__td">
                        <b>{t("total_price")}:</b>{" "}
                        {getIngredientCountPrice(ingredient)} $
                      </td>
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
                </Collapse.Panel>
              ))}
            </Collapse>
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
