// SPDX-License-Identifier: GPL-3.0-only
import React, { FC } from "react";
import { Typography, Divider } from "antd";
import './GroupReadme.css';

const { Title, Paragraph, Text } = Typography;

const GroupReadme: FC = () => {
  return (
    <div className="soldier-group-readme">
      <Typography>
        <Title level={3}>SCT（速度改造）</Title>
        <Paragraph>
          拥有更快的速度，但是负重上限较低。二改后，速度进一步增加，负重上限进一步减小，但负重速度略有提升（改造后军械库出售T3级T骨X骨）
        </Paragraph>
        <Title level={4}>一改</Title>
        <Paragraph>● 速度1.1</Paragraph>
        <Paragraph>● 负重10%</Paragraph>
        <Paragraph>● 初/满负重速度0.85/0.2</Paragraph>
        <Paragraph>● 低姿态速度+0.05</Paragraph>
        <Title level={4}>二改</Title>
        <Paragraph>● 速度1.2</Paragraph>
        <Paragraph>● 负重5%</Paragraph>
        <Paragraph>● 初/满负重速度0.95/0.3</Paragraph>
        <Paragraph>● 低姿态速度+0.1</Paragraph>
        <Title level={3}>GST（隐蔽改造）</Title>
        <Paragraph>
          拥有更强的隐匿性，但是速度减慢。（改造后军械库出售绿色披风）
        </Paragraph>
        <Title level={4}>一改</Title>
        <Paragraph>● 高调姿态隐匿+0.05，低调姿态隐匿+0.1</Paragraph>
        <Paragraph>● 速度0.95</Paragraph>● 初/满负重速度0.9/0.4
        <Title level={4}>二改</Title>
        <Paragraph>● 高调姿态隐匿+0.1，低调姿态隐匿+0.2</Paragraph>
        <Paragraph>● 速度0.85</Paragraph>
        <Paragraph>● 初/满负重速度0.8/0.3</Paragraph>
        <Title level={3}>HVY（重装改造）</Title>
        <Paragraph>
          拥有更好的准确性，以及负重上限提升，但是速度更慢，不过HVY在初达负重上限时没有负重惩罚。二改后，背包携带8件甲之后才会受到负重惩罚，这意味着HVY可以支持整个小组的补给，二改HVY满负重速度比其他改造满负重速度都要快。（改造后军械库出售T3防护插板）
        </Paragraph>
        <Title level={4}>一改</Title>
        <Paragraph>● 准确1.05</Paragraph>
        <Paragraph>● 初/满负重准确1.05/0.96</Paragraph>
        <Paragraph>● +0.1被发现概率</Paragraph>
        <Paragraph>● 速度0.95</Paragraph>
        <Paragraph>● 初/满负重速度0.95/0.45</Paragraph>
        <Paragraph>● 负重40%</Paragraph>
        <Title level={4}>二改</Title>
        <Paragraph>● 准确1.1</Paragraph>
        <Paragraph>● 初/满负重准确1.1/0.98</Paragraph>
        <Paragraph>● +0.2被发现概率</Paragraph>
        <Paragraph>● 速度0.85</Paragraph>
        <Paragraph>● 初/满负重速度0.85/0.55</Paragraph>
        <Paragraph>● 负重80%</Paragraph>
        <Title level={3}>TEL（支援改造）</Title>
        <Paragraph>
          拥有更快的呼叫支援速度，可选用更多种类的支援并拥有独特的军械库重型载具支援信号弹但移速降低，无法呼叫支援类无线电，而且倒地后会更快阵亡。需要和队友紧密配合。拥有防空炮的地图在防空炮被摧毁后没有这个限制。
        </Paragraph>
        <Title level={4}>二改</Title>
        <Paragraph>● 呼叫支援时间：0.1S</Paragraph>
        <Paragraph>● 速度0.85</Paragraph>
        <Paragraph>● 初/满负重速度0.8/0.3</Paragraph>
        <Paragraph>● 可以呼叫AC130空中炮艇等高阶火力打击</Paragraph>
        <Paragraph>● 部分支援电台被禁用</Paragraph>
        <Paragraph>● 进阶空投信标</Paragraph>
        <Title level={3}>default(普通人)</Title>
        <Paragraph>● 精准1.0</Paragraph>
        <Paragraph>● 初/满负重精准1.0/0.94</Paragraph>
        <Paragraph>● 速度1.0</Paragraph>
        <Paragraph>● 初/满负重速度0.9/0.4</Paragraph>
        <Paragraph>● 负重20%</Paragraph>
        <Paragraph>● 呼叫支援时间2.0S</Paragraph>
      </Typography>
    </div>
  );
};

export default GroupReadme;
