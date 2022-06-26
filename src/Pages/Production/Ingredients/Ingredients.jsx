import { Select, DatePicker, Table, Skeleton, Button, Drawer } from "antd";
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
import Content from "./Content";
import Swal from "sweetalert2";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Ingredients = () => {
  const dispatch = useDispatch();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [selectedIngredient, setSelectedIngredient] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modaltype, setModaltype] = useState("");
  const [refresh, setRefresh] = useState(false);

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
      title: t('price'),
      dataIndex: 'price',
      key: 'price'
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

  const selectedItemData = [];
  // HISTORY DATA
  modalIsOpen &&
    modaltype === "history" &&
    selectedIngredient?.items !== null &&
    selectedIngredient?.items.length > 0 &&
    selectedIngredient?.items?.forEach((item) => {
      selectedItemData.push({
        product: (
          <div>
            <b>{item?.count}</b>{" "}
            <span>
              {
                unit_id_options.find((x) => {
                  return x.id === selectedIngredient?.unit_id;
                }).label
              }
            </span>
          </div>
        ),
        price: item?.price?.toLocaleString(),
        usd: item?.usd_rate?.toLocaleString(),
        date: moment(item.ordered_at).format('DD MMM, YYYY, hh:mm:ss '),
      });
    });


    console.info(selectedIngredient?.items)

  // DELETE ITEM
  const deleteIngredient = (id) => {
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
        axios.delete(`${URL}/api/ingredients/${id}`, setToken()).then((res) => {
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
      `${URL}/api/ingredients/warehouses`,
      setToken()
    );

    if (response.status === 200) {
      setIngredients(response.data.payload);
      setLoading(false);
    }
  }, [refresh]);

  const dataSource = [];

  // TABLE DATA
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
      actions: (
        <div className="table-button__group">
          <Button
            className="table-btn"
            onClick={() => {
              setModaltype("edit");
              setSelectedIngredient(item);
              setModalIsOpen(true);
            }}
          >
            <i className="bx bx-edit"></i>
          </Button>
          <Button
            className="table-btn"
            onClick={() => deleteIngredient(item.ingredient_id)}
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
      title: t("action"),
      dataIndex: "actions",
      key: "key",
    },
  ];

  // MAIN RETURN
  return (
    <div className="section main-page">
      <h1 className="heading">{t("ingredients")}</h1>

      <Drawer
        title={t("orders_history")}
        onClose={() => {
          setModalIsOpen(false);
          setSelectedIngredient({});
        }}
        visible={modalIsOpen}
        width={500}
      >
        {modaltype === "history" ? (
          <Table
            columns={selectedItemColumns}
            dataSource={selectedItemData}
            pagination={false}
            rowKey="key"
          />
        ) : (
          <Content
            selectedItem={selectedIngredient}
            onClose={setModalIsOpen}
            type={modaltype}
            unitItems={unit_id_options}
            onRefresh={setRefresh}
            refresh={refresh}
          />
        )}
      </Drawer>

      <div className="content">
        <div className="content-top">
          <div className="content-top__group"></div>

          <div className="content-top__group">
            <Button
              type="primary"
              onClick={() => {
                setModaltype("add");
                setModalIsOpen(true);
              }}
              className="btn btn-primary"
            >
              {t("add_ingredient")}
            </Button>
          </div>
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
                      setSelectedIngredient(
                        ingredients.find((x) => {
                          return x.ingredient_id === record.key;
                        })
                      );
                    }
                  },
                };
              }}
            />

            <div className="responsive__table">
              {ingredients && ingredients.length > 0
                ? ingredients.map((item, index) => {
                    return (
                      <div
                        className="responsive__table-item justify-between"
                        key={index}
                        onClick={e => {
                          if (
                            e.target.classList[0] !== "table-btn" &&
                            e.target.classList[0] !== "bx" &&
                            e.target.classList[0] !== "ant-btn"
                          ) {
                            setModaltype("history");
                            setModalIsOpen(!modalIsOpen);
                            setSelectedIngredient(
                              ingredients.find((x) => {
                                return x.ingredient_id === item.ingredient_id;
                              })
                            );
                          }
                        }}
                      >
                        <div className="responsive__table-item__details-name">
                          <h3>{item?.ingredient_name}</h3>
                        </div>

                        <div>
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
                        <div className="table-button__group">
                        <Button
                          className="table-btn"
                          onClick={() => {
                            setModaltype("edit");
                            setSelectedIngredient(item);
                            setModalIsOpen(true);
                          }}
                        >
                          <i className="bx bx-edit"></i>
                        </Button>
                        <Button
                          className="table-btn"
                          onClick={() => deleteIngredient(item.ingredient_id)}
                        >
                          <i className="bx bx-trash"></i>
                        </Button>
        </div>
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

export default Ingredients;
