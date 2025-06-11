import './About.css'
import { assets } from '../../../assets/assets'

const About = () => {
  return (
    <div className="about-container" id="about">
        <h1>About ChemBridge</h1>
      <div style={{backgroundColor: "#ebf7ef"}} className="subsection">
        <img src={assets.video} alt="" />
        <div className="info">
            <h3>Module các video mô phỏng thí nghiệm hóa học</h3>
            <p>Một số chủ đề có nội dung liên quan đến thực hành thí nghiệm đã được lựa chọn để xây dựng video. Các thí nghiệm được tiến hành trong PTN và ghi hình, chỉnh sửa nhằm tạo điều kiện cho HS có thể quan sát, đồng thời là công cụ trực quan để GV có thể sử dụng trong quá trính dạy học. Các video được link trực tiếp với các bài học liên quan và ngược lại thuận lợi cho người sử dụng tìm kiếm học liệu. </p>
        </div>
      </div>
      <div style={{backgroundColor: "#fafce5"}} className="subsection">
        <div className="info">
            <h3>Module ôn tập</h3>
            <p>Gồm các bài tập phát triển năng lực được xây dựng theo các chủ đề, HS sau khi học các bài giảng được link đến phần luyện tập của mỗi chủ đề tự củng cố và kiểm tra kết quả học tập của mình sau khi học tập. </p>
        </div>
        <img src={assets.question} alt="" />
      </div>
    </div>
  )
}

export default About
