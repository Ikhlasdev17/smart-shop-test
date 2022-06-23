import {
  Select,
  DatePicker,
  Table,
  Skeleton,
  Button,
  Drawer,
  Input,
  InputNumber,
  Modal,
  Form,
  message,
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

const OrderIngredient = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [refresh, setRefresh] = useState(false);
  let updatedProducts = [];
  const [usd_rate, setUsdRate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [responsiveModalIsOpen, setResponsiveModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

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

  // FETCHING INGREDIENTS
  useEffect(async () => {
    setLoading(true);

    const response = await axios.get(
      `${URL}/api/ingredients/warehouses`,
      setToken()
    );

    if (response.status === 200) {
      setIngredients(response.data.payload);
      setLoading(false);
    }
  }, [refresh]);

  // UPDATE PRODUCTS
  const handleChange = (e, currentItem, type) => {
    const index = updatedProducts.findIndex(
      (item) => item.ingredient_id === currentItem.ingredient_id
    );
    if (index === -1) {
      updatedProducts = [
        ...updatedProducts,
        {
          ingredient_id: currentItem.ingredient_id,
          price: type === "price" ? e : currentItem.price,
          count: type === "count" ? e : 1,
        },
      ];
    } else {
      if (type === "price") {
        updatedProducts[index].price = e;
      }

      if (type === "count") {
        updatedProducts[index].count = e;
      }

      if (e === null) {
        if (type === "price") {
          if (
            updatedProducts[index].count !== null &&
            updatedProducts[index].count !== undefined
          ) {
            updatedProducts[index].price = 0;
          }
          if (
            updatedProducts[index].count === null ||
            updatedProducts[index].count === undefined ||
            updatedProducts[index].count === 0
          ) {
            updatedProducts.splice(index, 1);
          }
        } else {
          if (
            updatedProducts[index].price !== null &&
            updatedProducts[index].price !== undefined
          ) {
            updatedProducts[index].count = 0;
          }
          if (
            updatedProducts[index].price === null ||
            updatedProducts[index].price === undefined ||
            updatedProducts[index].price === 0
          ) {
            updatedProducts.splice(index, 1);
          }
        }
      } else {
        if (type === "price") {
          if (
            updatedProducts[index].count === null ||
            updatedProducts[index].count === undefined ||
            updatedProducts[index].count === 0
          ) {
            updatedProducts[index].count = 1;
          }
        } else {
          if (
            updatedProducts[index].price === null ||
            updatedProducts[index].price === undefined ||
            updatedProducts[index].price === 0
          ) {
            updatedProducts[index].price = 0;
          }
        }
      }
    }
  };

  // SAVE PRODUCTS
  const handleSave = async () => {
    if (updatedProducts.length < 1) {
      Swal.fire({
        title: t("malumotni_toliq_kiriting"),
        icon: "warning",
        confirmButtonText: t("ok"),
      });
    } else {
      setUploading(true);
      setLoading(true);
      const response = await axios.post(
        `${URL}/api/ingredients/warehouses`,
        {
          usd_rate,
          ingredients: updatedProducts,
        },
        setToken()
      );
      if (response.status === 200) {
        setRefresh(!refresh);
        setLoading(false);
        setUploading(false);
        setUsdRate(null);
        Swal.fire({
          title: t("muaffaqiyatli"),
          icon: "success",
          confirmButtonText: t("ok"),
        });
      }
    }
  };

  // TABLE DATA
  const dataSource = [];
  ingredients?.map((item) => {
    dataSource.push({
      key: item?.ingredient_id,
      product: (
        <div className="product__table-product">
          <div className="product__tabel-product_name">
            <h3>{item?.ingredient_name}</h3>
          </div>
        </div>
      ),
      count: (
        <div className="product__table-count flex">
          <b>{item?.count}</b>{" "}
          <span>
            {
              unit_id_options.find((x) => {
                return x.id === item?.unit_id;
              }).label
            }
          </span>
        </div>
      ),
      orderCount: (
        <InputNumber
          readOnly={usd_rate === 0 || usd_rate === null}
          size="small"
          className="form__input table_input"
          placeholder={
            unit_id_options.find((x) => {
              return x.id === item?.unit_id;
            }).label
          }
          onChange={(e) => {
            handleChange(e, item, "count");
          }}
        />
      ),
      orderPrice: (
        <InputNumber
          readOnly={usd_rate === 0 || usd_rate === null}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }
          size="small"
          className="form__input table_input"
          placeholder={t("price")}
          onChange={(e) => {
            handleChange(e, item, "price");
          }}
        />
      ),
    });
  });

  // TABLE HEADERS
  const columns = [
    {
      title: t("ingredient"),
      dataIndex: "product",
      key: "key",
    },
    {
      title: t("ingredient_quantity"),
      dataIndex: "count",
      key: "key",
    },
    {
      title: t("count"),
      dataIndex: "orderCount",
      key: "key",
    },
    {
      title: t("price"),
      dataIndex: "orderPrice",
      key: "key",
    },
  ];

  // MAIN RETURN
  return (
    <div className="section main-page">
      <h1 className="heading">{t("order")}</h1>
      <div className="content">
        {responsiveModalIsOpen && (
          <Modal
            footer={
              <Button onClick={() => setResponsiveModalIsOpen(false)}>
                {t("save")}
              </Button>
            }
            visible={responsiveModalIsOpen}
            onCancel={() => {
              setResponsiveModalIsOpen(false);
              setSelectedProduct({});
            }}
            title={t("order")}
          >
            <Form layout="vertical">
              <Form.Item
                label={
                  unit_id_options.find((x) => {
                    return x.id === selectedProduct?.unit_id;
                    return x.id === selectedProduct?.unit_id;
                  }).label
                }
                onChange={(e) => {
                  handleChange(e, selectedProduct, "count");
                  handleChange(e, selectedProduct, "count");
                }}
              >
                <InputNumber
                  readOnly={usd_rate === 0 || usd_rate === null}
                  size="small"
                  className="form__input"
                  placeholder={
                    unit_id_options.find((x) => {
                      return x.id === selectedProduct?.unit_id;
                      return x.id === selectedProduct?.unit_id;
                    }).label
                  }
                  onChange={(e) => {
                    handleChange(e, selectedProduct, "count");
                    handleChange(e, selectedProduct, "count");
                  }}
                />
              </Form.Item>
              <Form.Item label={t("price")}>
                <InputNumber
                  readOnly={usd_rate === 0 || usd_rate === null}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                  }
                  size="small"
                  className="form__input"
                  placeholder={t("price")}
                  onChange={(e) => {
                    handleChange(e, selectedProduct, "price");
                    handleChange(e, selectedProduct, "price");
                  }}
                />
              </Form.Item>
            </Form>
          </Modal>
        )}
        <div className="content-top">
          <div className="content-top__group">
            <InputNumber
              size="small"
              className="form__input"
              placeholder={t("USD")}
              value={usd_rate}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              }
              onChange={(e) => {
                setUsdRate(e);
              }}
            />
          </div>

          <div className="content-top__group">
            <Button
              type="primary"
              onClick={handleSave}
              className="btn btn-primary"
              disabled={
                usd_rate === 0 || usd_rate === null || usd_rate === undefined
              }
              loading={uploading}
            >
              {t("save")}
            </Button>
          </div>
        </div>

        <div className="content-body">
          <Skeleton loading={loading} active>
            <Table
              className="content-table lg-table"
              dataSource={dataSource}
              columns={columns}
            />

            <div className="responsive__table">
              {ingredients && ingredients.length > 0
                ? ingredients.map((item, index) => {
                    return (
                      <div
                        className="responsive__table-item justify-between"
                        key={index}
                        onClick={() => {
                          setSelectedProduct(item);
                          setResponsiveModalIsOpen(true);
                        }}
                      >
                        <div className="responsive__table-item__details-name">
                          <h3>{item?.ingredient_name}</h3>
                        </div>

                        <div className="responsive__table-item__details-count">
                          <h3>{item?.count}</h3>
                          <span>
                            {
                              unit_id_options.find((x) => {
                                return x.id === item?.unit_id;
                              }).label
                            }
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

export default OrderIngredient;
