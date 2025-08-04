import React, { useEffect, useState } from 'react';
import { createSeal, updateSeal } from '@/api/sealApi';
import axios from 'axios';

const SealEditorModal = ({ seal, onClose, onSaved }) => {
  const [placeType, setPlaceType] = useState([]);
  useEffect(() => {
    axios.get(`/api/place-types`)
      .then((res) => setPlaceType(res.data))
      .catch((err) => {
        console.error('[장소 타입 로딩 오류]', err);
        setPlaceType([]);
      });
  }, []);

  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    placeType: { id: 1 },
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (seal) {
      setForm(seal);
      const fullUrl = seal.imageUrl?.startsWith('http')
        ? seal.imageUrl
        : seal.imageUrl;
      setPreviewUrl(fullUrl);
    }
  }, [seal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceTypeChange = (e) => {
    setForm((prev) => ({
      ...prev,
      placeType: { id: Number(e.target.value) },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return form.imageUrl;

    const formData = new FormData();
    formData.append('file', imageFile);

    const res = await axios.post('/api/seal-uploads/image', formData);
    return res.data;
  };

  const handleSubmit = async () => {
    const finalImageUrl = await uploadImage();

    const sealData = {
      ...form,
      imageUrl: finalImageUrl,
    };

    const action = seal
      ? updateSeal(seal.id, sealData)
      : createSeal(sealData);

    action.then(() => {
      onSaved();
      onClose();
    });
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .modal-content {
          background: white;
          padding: 54px;
          border-radius: 4px;
          width: 65%;
          max-width: 90vw;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          position: relative;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-close {
          position: absolute;
          top: 12px;
          right: 16px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-content label {
          display: block;
          margin-top: 12px;
          font-weight: bold;
        }

        .modal-content input,
        .modal-content select {
          width: 100%;
          padding: 6px;
          margin-top: 4px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        .modal-content button {
          margin-top: 16px;
          margin-right: 8px;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
          width: 100%;
          font-weight:bold;
          color : #000;
        }

        .modal-content img {
          margin-top: 8px;
          border: 1px solid #eee;
        }
      `}</style>

      <div className="modal-overlay">

        <div className="modal-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', height: '22em', }}>

            <div style={{ width: '200px', marginRight: '15px' }}>
              <label>이미지 업로드</label>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '18em' }}>
                <div style={{ height: '100%', backgroundColor: '#eee', width: '100%' }}>{previewUrl && (<img src={previewUrl} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover', border: '2px solid red' }} />)}</div>

                <label htmlFor="file-upload" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#000', color: 'white', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center' }}> 이미지 업로드</label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

              </div>
            </div>

            <div style={{ flexGrow: 1 }}>
              <label>이름</label>
              <input name="name" value={form.name} onChange={handleChange} />

              <label>카테고리</label>
              <select value={form.placeType.id} onChange={handlePlaceTypeChange}>
                {placeType.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div><button onClick={handleSubmit}>저장</button></div>
          <div><button onClick={onClose}>취소</button></div>
        </div>
      </div>
    </>
  );
};

export default SealEditorModal;
