import React from "react";
import { Form, Input, InputNumber, Select, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import axios from "axios";
import { setToken, URL } from "../../../assets/api/URL";
const Content = ({
  type,
  selectedItem,
  onClose,
  unitItems,
  onRefresh,
  refresh,
}) => {
  const [ingredient, setIngredient] = React.useState({
    name: "",
    unit_id: 1,
  });
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);

  // SET INGREDIENT STATE
  React.useEffect(() => {
    if (type === "edit") {
      setIngredient({
        name: selectedItem.ingredient_name,
        unit_id: selectedItem.unit_id,
      });
    }

    if (type === "add") {
      setIngredient({
        name: "",
        unit_id: 1,
      });
    }
  }, [selectedItem, type]);

  // SUBMIT DATA
  const handleSubmit = async () => {
    if (ingredient.name === "" || ingredient.unit_id === "") {
      Swal.fire({
        title: t("malumotni_toliq_kiriting"),
        icon: "error",
        confirmButtonText: t("OK"),
      });
    }
    if (ingredient.name !== "" && ingredient.unit_id !== "") {
      setLoading(true);
      if (type === "add") {
        const response = await axios
          .post(`${URL}/api/ingredients`, ingredient, setToken())
          .finally(() => setLoading(false));
        if (response.status === 200) {
          onRefresh(!refresh);
          Swal.fire({
            title: t("muaffaqiyatli"),
            icon: "success",
            confirmButtonText: t("OK"),
          });
          onClose(false);
          setIngredient({
            name: "",
            unit_id: 1,
          });
        }
      } else if (type === "edit") {
        const response = await axios
          .put(
            `${URL}/api/ingredients/${selectedItem.ingredient_id}`,
            ingredient,
            setToken()
          )
          .finally(() => setLoading(false));
        if (response.status === 204 || response.status === 200) {
          onRefresh(!refresh);
          Swal.fire({
            title: t("muaffaqiyatli"),
            icon: "success",
            confirmButtonText: t("OK"),
          });
          onClose(false);
          setIngredient({
            name: "",
            unit_id: 1,
          });
        }
      }
    }
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label={t("ingredient_name")}>
          <Input
            placeholder={t("ingredient_name")}
            className="form__input"
            onChange={(e) => {
              setIngredient({ ...ingredient, name: e.target.value });
            }}
            value={ingredient.name}
          />
        </Form.Item>

        <Form.Item label={t("unit")}>
          <Select
            onChange={(e) => {
              setIngredient({ ...ingredient, unit_id: e });
            }}
            value={ingredient.unit_id}
            className="form__input"
          >
            {unitItems.map((item) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            className="btn btn-primary"
            htmlType="submit"
            onClick={handleSubmit}
            loading={loading}
          >
            {t("save")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Content;
