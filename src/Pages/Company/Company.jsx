import React, { useState, useEffect } from "react";

import "./Profile.scss";

import { useTranslation } from "react-i18next";
import axios from "axios";
import Dragger from "antd/lib/upload/Dragger";
import { Button, Form, Input, message } from "antd";
import { setToken, URL } from "../../assets/api/URL";
import swal from "sweetalert";

import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch } from "react-redux";
import { changeData } from "../../redux/companySlice";

const Company = () => {
  const { t } = useTranslation();
  const [photoUploaded, setPhotoUploaded] = useState("default");
  const [userData, setUserData] = useState()
  const [newUser, setUser] = useState({
    name: userData?.name,
    phone: userData?.phone,
    address: userData?.address,
    image: userData?.image
  });
  const dispatch = useDispatch()


  useEffect(() => {
    axios.get(`${URL}/api/company`, setToken())
      .then((res) => {
        setUserData(res.data.payload)
        setUser(res.data.payload)
      })
    }, [])


  

  const photoUploader = (e) => {
    setPhotoUploaded("loading");

    const formData = new FormData();
    formData.append("file", e.file.originFileObj);
    formData.append("upload_preset", "smart-shop");

    axios
      .post(
        "https://api.cloudinary.com/v1_1/http-electro-life-texnopos-site/image/upload",
        formData
      )
      .then((res) => {
        setUser((prev) => ({ ...newUser, image: res.data.secure_url }));
        setPhotoUploaded("ok");
      });
  };

  const updateUserData = async () => {
    if (newUser.name !== "") {
      const data = {
        name: newUser?.name,
        phone: newUser?.phone,
        address: newUser?.address,
        image: newUser?.image
      }
      const res = await axios.patch(
        `${URL}/api/company`,
        data,
        setToken()
      ); 
      if (res.status === 200) {
        swal({
          title: t("muaffaqiyatli"),
          icon: "success",
        });
        dispatch(changeData(data))
        setPhotoUploaded("default");
      }
    } else {
      message.warn(t("malumotni_toliq_kiriting"))
    }
  };

  return (
    <div className="section">
      <h1 className="heading">{userData?.name}</h1>
      <div className="content">
        <div className="content-top"></div>

        <Form layout="vertical">
          <div className="profile__update">
            <div className="profile__info">
              <Form.Item label={t("brend")}>
                <Input
                  className="form__input"
                  placeholder={t("brend")}
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </Form.Item>   
              <Form.Item label={t("telefon_raqami")}>
                <Input
                  className="form__input"
                  placeholder={t("telefon_raqami")}
                  type="text"
                  value={newUser.phone}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </Form.Item>   
              <Form.Item label={t("address")}>
                <Input
                  className="form__input"
                  placeholder={t("address")}
                  type="text"
                  value={newUser.address}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
              </Form.Item>   
            </div>
            <div className="profile__settings">
              <Dragger
                className="photo__uploader"
                onChange={photoUploader}
                showUploadList={false}
              >
                {photoUploaded === "default" ? (
                  <>
                    <i className="bx bx-cloud-upload ant-upload-drag-icon"></i>
                    <h4>{t("rasm_yuklang")}</h4>
                    <p>{t("rasimni_tanlash_text")}</p>
                  </>
                ) : photoUploaded === "ok" ? (
                  <>
                    <i className="bx bx-check-circle success-icon"></i>
                    <h4>{t("muaffaqiyatli")}</h4>
                  </>
                ) : (
                  photoUploaded === "loading" && (
                    <>
                      <i className="bx bx-time-five ant-upload-drag-icon"></i>
                      <h4>{t("kuting")}</h4>
                    </>
                  )
                )}
              </Dragger>
              <br />
              <Button
                style={{ width: "100%" }}
                className="btn btn-primary"
                onClick={(e) => {
                  setUser({...newUser, image: null}) 
                  message.success(t("muaffaqiyatli"))
                  setPhotoUploaded("default")
                }}
                disabled={newUser.image === null}
              >
                {t("remove__image")}
              </Button>
              <br />

              <Button
                style={{ width: "100%" }}
                className="btn btn-primary"
                onClick={updateUserData}
              >
                {t("save")}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Company;
