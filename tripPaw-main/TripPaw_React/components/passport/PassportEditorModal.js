//등록/수정 모달
import React, { useEffect, useState } from 'react';
import { createPassport, updatePassport, checkPassNumDuplicate, } from '@/api/passportApi';
import axios from 'axios';

const PassportEditorModal = ({ passport, onClose, onSaved, memberId }) => {
  const [form, setForm] = useState({
    petName: '',
    species: '',
    petAge: '',
    petGender: '',
    imageUrl: '',
    passNum: '',
    member: { id: memberId },
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPassNumValid, setIsPassNumValid] = useState(true);

  useEffect(() => {
    if (passport) {
      setForm(passport);

      const fullUrl = passport.imageUrl?.startsWith('http')
        ? passport.imageUrl
        : passport.imageUrl;

      setPreviewUrl(fullUrl);
    }
  }, [passport]);

  useEffect(() => {
    if (form.passNum) {
      checkPassNumDuplicate(form.passNum).then((res) => {
        setIsPassNumValid(!res.data);
      });
    }
  }, [form.passNum]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

    const passportData = {
      ...form,
      imageUrl: finalImageUrl,
    };

    const action = passport
      ? updatePassport(passport.id, passportData)
      : createPassport(passportData);

    action.then(() => { onSaved(); onClose(); });
  };

  return (
    <>
      <style>{`
        .passport-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .passport-modal {
          background: white;
          padding: 54px;
          border-radius: 4px;
          width: 65%;
          max-width: 60vw;
          min-width: 500px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          position: relative;
          animation: fadeIn 0.3s ease-out;
        }

        .passport-modal label {
          display: block;
          margin-top: 12px;
          font-weight: bold;
        }

        .passport-modal input,
        .passport-modal select {
          width: 100%;
          padding: 6px;
          margin-top: 4px;
          border-width: 0 0 1px;
          border-color: #ccc;
          outline: none;
        }
      `}</style>

      <div className="passport-overlay">
        <div className="passport-modal">
          {/* <button className="passport-close" onClick={onClose}>×</button> */}
          <h3 style={{ fontWeight: 'bold', fontSize: '22px' }}>{passport ? '여권 수정' : '여권 등록'}</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', height: '22em' }}>

            <div style={{ width: '200px', marginRight: '15px' }}>
              <label></label>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '18em' }}>
                <div style={{ height: '100%', backgroundColor: '#eee', width: '100%' }}>{previewUrl && (<img src={previewUrl} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />)}</div>
                <label htmlFor="file-upload" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#000', color: 'white', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center' }}> 이미지 업로드</label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
            </div>

            <div style={{ flexGrow: 1 }}>
              <label>반려동물 이름</label>
              <input name="petName" value={form.petName} onChange={handleChange} />

              <label>종(species)</label>
              <input name="species" value={form.species} onChange={handleChange} />

              <label>나이</label>
              <input name="petAge" type="number" value={form.petAge} onChange={handleChange} />

              <label>성별</label>
              <select name="petGender" value={form.petGender} onChange={handleChange}>
                <option value="">선택</option>
                <option value="암컷">암컷</option>
                <option value="수컷">수컷</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '32px' }}>
            <button style={{ fontSize: '16px', fontWeight: 'bold', padding: '10px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              onClick={handleSubmit}>저장</button>
            <button style={{ fontSize: '16px', fontWeight: 'bold', padding: '10px', backgroundColor: '#fff', border: '2px solid #000', borderRadius: '5px', cursor: 'pointer' }}
              onClick={onClose}>취소</button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PassportEditorModal;
