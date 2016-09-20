Title:【FPGA/图像处理】几何变换-旋转
Tags: FPGA, FPGA-Imaging-Library, 图像处理,几何变换,旋转
Date: 2015.05.30,00:30:00
Summary:图像处理系列文章基本都是我本科毕设论文同步发布，这个项目以LGPL许可被发布在http://fil.dtysky.moe。旋转同样是仿射变换的一种特例，它接受一个角度，将图像绕着某个中心进行转动，适合逆向映射。旋转的实现有多种，比如两次错切的旋转<sup>[26]</sup>、直接坐标变换<sup>[27]</sup>等，中心点的选取方式也有许多，但对于FPGA采用图像的几何中心较为合适。。本节将会说明如何用FPGA实现旋转的模块.....

旋转同样是仿射变换的一种特例，它接受一个角度，将图像绕着某个中心进行转动，适合逆向映射。旋转的实现有多种，比如两次错切的旋转<sup>[26]</sup>、直接坐标变换<sup>[27]</sup>等，中心点的选取方式也有许多，但对于FPGA采用图像的几何中心较为合适。。本节将会说明如何用FPGA实现旋转的模块。
这个IP核的资源在这里：
[Rotate](https://github.com/dtysky/FPGA-Imaging-Library/tree/Publish/Geometry/Rotate)

****

# 3 算法实现

明确了设计和架构，便可以进行算法的实现。本章将会说明如何实现图像处理的算法，以及如何运用它们。

## 3.21 几何变换-旋转

旋转同样是仿射变换的一种特例，它接受一个角度，将图像绕着某个中心进行转动，适合逆向映射。旋转的实现有多种，比如两次错切的旋转<sup>[26]</sup>、直接坐标变换<sup>[27]</sup>等，中心点的选取方式也有许多，但对于FPGA采用图像的几何中心较为合适。。本节将会说明如何用FPGA实现旋转的模块。

### 3.21.1 原理

此设计中旋转的前向映射基本原理如式3-21-1，其中angle为旋转角度,$x_c$和$y_c$分别为图像中心横纵坐标。对于逆向映射应该对此式进行调整，变换为3-21-2的形式，可见旋转操作比较复杂，不仅涉及多次符号乘法、符号加法，还涉及到三角函数的计算。

<p>$$\begin{cases}Q[x_t,y_t] = I[x,y]  \\x_t = xc + (x - xc) * cos(a) - (y - yc)*sin(a)\\ y_t = yc + (x - xc) * sin(a) + (y - yc)*cos(a)\\x \in[0, w) ,y \in[0, h)\ \end{cases}.\ \ \ \ \ \ \ \ (3-21-1)$$</p>

<p>$$\begin{cases}I[x,y] = Q[x_t,y_t]  \\x = (x_t - xc) * cos(a) + (y_t - yc) * sin(a) + xc\\ y = (-x_t + xc) * sin(a) + (y_t - yc) * cos(a) + yc\\x_t \in[0, w) ,y_t \in[0, h)\ \end{cases}.\ \ \ \ \ \ \ \ (3-21-2)$$</p>

首先要考虑三角函数的计算，如3.1中所述，FPGA中的特殊函数计算需要用查找表来实现，所以需要编写一个脚本来生成查找表，同时由于三角函数的值可能为负数，并且verilog中符号系统是补码系统，所以需要生成的是角度和此角度下三角函数值的补码。由于正弦和余弦的值域为[-1, 1]，同时一般用于变换的角度为[0,359]，所以综合考虑，最终选择将角度划分为360个点，使用1位符号位、1位整数位和18位的小数位的数据来表示函数值，这其中的难点在于如何将一个浮点数转换为20位的定点数补码，实现函数如下。

    :::python
      def format(num):
        r, d = format(num, 'f').split('.')
        r = '0' + r[0] if len(r) == 1 else '1' + r[1]
        d = float('0.' + d)
        res = ''
        for i in xrange(18):
            d = d * 2
            res += '1' if d >= 1 else '0'
            d = d - 1 if d >= 1 else d
        res = r[1] + res
        if r[0] == '1':
            if eval(res) == 0:
                res = '0'
            else:
                res = bin(2 ** 19 - eval('0b' + res))[2:]
            for i in xrange(19 - len(res)):
                res = '0' + res
        res = r[0] + res
        if res == '10000000000000000000':
            res = '00000000000000000000'
        return res

旋转变换同样需要符号舍入，但整数位只有1位，所以没有溢出风险，可以将其简化，仅仅裁剪输出即可。

### 3.21.2 设计

根据原理可知，Rotate核(以下简称RTT核)需要四次符号乘法、四次符号舍入操作和四次符号加法，并且需要和基于行列计数的帧控制器进行合作。故其需要的配置参数与端口如表3-21-1和表3-21-2。

<center>
<table border="1" cellspacing="0">
<tr>
<th>名字</th>
<th>类型</th>
<th>范围</th>
<th>默认值</th>
<th>说明</th>
</tr>
<td>work_mode</td>
<td>无符号</td>
<td>0为流水线模式，1为请求响应模式</td>
<td>0</td>
<td>模块的工作模式。</td>
</tr>
<tr>
<tr>
<td>data_width</td>
<td>无符号</td>
<td>1 - 12</td>
<td>8</td>
<td>数据位宽。</td>
</tr>
<tr>
<td>im_width</td>
<td>无符号</td>
<td>1 - 4096</td>
<td>320</td>
<td>图像宽度。</td>
</tr>
<tr>
<td>im_height</td>
<td>无符号</td>
<td>1 - 4096</td>
<td>240</td>
<td>图像高度。</td>
</tr>
<tr>
<td>im_width_bits</td>
<td>无符号</td>
<td>取决于图像宽度</td>
<td>9</td>
<td>图像宽度的位宽。</td>
</tr>
<tr>
<td>mul_delay</td>
<td>无符号</td>
<td>取决于乘法器配置，1-14</td>
<td>3</td>
<td>乘法器延迟。</td>
</tr>
<tr>
<td>ram_RL</td>
<td>无符号</td>
<td>取决于帧控制器</td>
<td>7</td>
<td>帧控制器输出延迟。</td>
</tr>
</table>
表3-21-1 配置参数
</center>
<br>
<center>
<table border="1" cellspacing="0">
<tr>
<th>名字</th>
<th>端口</th>
<th>类型</th>
<th>范围</th>
<th>默认值</th>
<th>说明</th>
</tr>
<td>clk</td>
<td>输入</td>
<td>无符号</td>
<td>无</td>
<td>无</td>
<td>Clock.</td>
</tr>
<tr>
<td>rst_n</td>
<td>输入</td>
<td>无符号</td>
<td>无</td>
<td>无</td>
<td>复位，低有效。</td>
</tr>
<tr>
<td>angle</td>
<td>input</td>
<td>无符号</td>
<td>0 - 359</td>
<td>无</td>
<td>旋转角度。</td>
</tr>
<tr>
<td>in_enable</td>
<td>输入</td>
<td>无符号</td>
<td>无</td>
<td>无</td>
<td>输入数据使能，在流水线模式下，它是另一个复位信号，在请求响应模式下，只有在它有效的时候in_data才会被真正地改变。</td>
</tr>
<tr>
<td>frame_in_ready</td>
<td>输入</td>
<td>无符号</td>
<td>无</td>
<td>无</td>
<td>连接到帧控制器的out_ready。</td>
</tr>
<tr>
<td>frame_in_data</td>
<td>输入</td>
<td>无符号</td>
<td>data_width - 1 : 0</td>
<td>无</td>
<td>连接到帧控制器的out_data。</td>
</tr>
<tr>
<td>frame_enable</td>
<td>output</td>
<td>无符号</td>
<td>无</td>
<td>无</td>
<td>连接到帧控制器的in_enable。</td>
</tr>
<tr>
<td>frame_out_count_x</td>
<td>output</td>
<td>无符号</td>
<td>im_width_bits - 1 : 0</td>
<td>无</td>
<td>连接到帧控制器的in_count_x。</td>
</tr>
<tr>
<td>out_count_y</td>
<td>output</td>
<td>无符号</td>
<td>im_width_bits - 1 : 0</td>
<td>无</td>
<td>连接到帧控制器的in_count_y。</td>
</tr>
<tr>
<td>out_ready</td>
<td>output</td>
<td>无符号</td>
<td>无</td>
<td>无</td>
<td>输出数据有效，在两种模式下，这个信号都会在out_data可以被读取的时候有效。</td>
</tr>
<tr>
<td>out_data</td>
<td>output</td>
<td>无符号</td>
<td>color_width - 1 : 0</td>
<td>无</td>
<td>输出数据，将会和out_ready同步输出。</td>
</tr>
</table>
表3-21-2 端口
</center>
</center>
<br>
<center>
<table border="1" cellspacing="0">
<tr>
<th>名字</th>
<th>类型</th>
<th>说明</th>
</tr>
<tr>
<td>Sin</td>
<td>SinLUT</td>
<td>获取角度的正弦。</td>
</tr>
<tr>
<td>Cos</td>
<td>CosLUT</td>
<td>获取角度的余弦。</td>
</tr>
<tr>
<td>MulX1</td>
<td>Multiplier13Sx20SRTT</td>
<td>13位有符号数和20位有符号数的乘法器，被用于定点数的乘法。你可以自己配置这个乘法器，然后更改"mul_delay"，但所有的乘法器必须拥有相同的流水线级数，并且不能更改端口的配置！</td>
</tr>
<tr>
<td>MulX2</td>
<td>Multiplier13Sx20SRTT</td>
<td>13位有符号数和20位有符号数的乘法器，被用于定点数的乘法。你可以自己配置这个乘法器，然后更改"mul_delay"，但所有的乘法器必须拥有相同的流水线级数，并且不能更改端口的配置！</td>
</tr>
<tr>
<td>MulY1</td>
<td>Multiplier13Sx20SRTT</td>
<td>13位有符号数和20位有符号数的乘法器，被用于定点数的乘法。你可以自己配置这个乘法器，然后更改"mul_delay"，但所有的乘法器必须拥有相同的流水线级数，并且不能更改端口的配置！</td>
</tr>
<tr>
<td>MulY2</td>
<td>Multiplier13Sx20SRTT</td>
<td>13位有符号数和20位有符号数的乘法器，被用于定点数的乘法。你可以自己配置这个乘法器，然后更改"mul_delay"，但所有的乘法器必须拥有相同的流水线级数，并且不能更改端口的配置！</td>
</tr>
<tr>
<td>FRSX1</td>
<td>FixedRoundSigned</td>
<td>用于有符号浮点数的舍入。</td>
</tr>
<tr>
<td>FRSX2</td>
<td>FixedRoundSigned</td>
<td>用于有符号浮点数的舍入。</td>
</tr>
<tr>
<td>FRSY1</td>
<td>FixedRoundSigned</td>
<td>用于有符号浮点数的舍入。</td>
</tr>
<tr>
<td>FRSY2</td>
<td>FixedRoundSigned</td>
<td>用于有符号浮点数的舍入。</td>
</tr>
</table>
表3-3-3 子模块
</center>

### 3.21.3 实现

根据3.21.2的设计便可以实现一个RTT核，流水线模式和请求响应模式实现如下。

#### 3.21.3.1 流水线模式

在帧控制器的输出使能后1个周期第一个结果被输出，开始流水化工作，波形如图3-21-1。
<center>
![图3-21-1 流水线模式时序](http://src.dtysky.moe/image/f-i-l/3/21/1.png)
图3-21-1 流水线模式时序
</center>

#### 3.21.3.2 请求响应模式读取

基本同3.21.3.1，但只有在in\_enable上升沿时计数器才会加1才会被改变，波形如图3-21-2。
<center>
![图3-21-1 流水线模式时序](http://src.dtysky.moe/image/f-i-l/3/21/2.png)
图3-21-1 流水线模式时序
</center>

#### 3.21.3.3 IP核GUI

完成功能后对RTT核进行了封装，封装如图3-21-3。
<center>
![图3-21-3 RTT核的GUI](http://src.dtysky.moe/image/f-i-l/3/21/3.png)
图3-21-3 RTT核的GUI
</center>

### 3.21.4 仿真

只对RGB图像和灰度图像进行测试，考虑到仿真设计模块比较多，出于仿真压力，我选择了一张图像的灰度模式进行三套参数的测试，原始图像如图3-21-4。

<center>
![图3-21-4 仿真原始图像](http://src.dtysky.moe/image/f-i-l/3/21/4.jpg)
图3-21-4 仿真原始图像
</center>

仿真参数如表3-16-4所示，选择原则是可以被二进制表示和不可以被表示的值都包含。

<center>
<table border="1" cellspacing="0">
<tr>
<th>angle</th>
</tr>
<tr>
<td>45</td>
</tr>
<tr>
<td>131</td>
</tr>
<tr>
<td>270</td>
</tr>
</table>
表3-16-4 仿真参数
</center>

仿真并进行PSNR测试，仿真结果如图3-21-5所示。
<center>
![图3-21-5 仿真结果](http://src.dtysky.moe/image/f-i-l/3/21/5.png)
图3-21-5 仿真结果，左侧为流水线模式下的HDL功能仿真结果，中间为请求响应模式下的HDL功能仿真结果，右侧为软件仿真结果
</center>

### 3.21.5 资源和时序

最终实现与图像大小和数据位宽有关，这里只分析大小为512x512和数据位宽为8时的状况，根据Vivado生成的报表，主要资源耗费如表3-21-5。

<center>
<table border="1" cellspacing="0">
<tr>
<th>Slice LUTs*</th>
<th>Slice Registers</th>
<th>DSP</th>
</tr>
<tr>
<td>543</td>
<td>245</td>
<td>4</td>
</tr>
</table>
表3-21-5 主要资源耗费
</center>

同时根据时序报告，最大的Data Path Delay(数据路径延迟)为4.414ns，即：

>FMax = 226.55MHz

即说明，Rotate核在流水线模式下，理论上在处理1080p全高清图像时可以达到109帧。
与3.20相同，此FMax低于期望值，也来自于舍入核的加法，考虑时间此处暂时不做优化。
由于数据路径延迟和应用的最终约束设置强相关，所以仅供参考。

### 3.21.6 分析与结论

PSNR如表3-21-6。

<center>
<table border="1" cellspacing="0">
<tr>
<th>1-131</th>
<th>1-270</th>
<th>1-45</th>
<th>Total</th>
</tr>
<tr>
<td>1000000.00</td>
<td>54.89</td>
<td>1000000.00</td>
<td>666684.96</td>
</tr>
</table>
表3-21-6 PSNR
</center>

PSNR对于某些参数为最大值，对于一些不是，最终误差来自于符号乘法和查找表自身的误差，但PSNR均为50以上，可见在测试范围内，RTT核可以满足处理需求，设计成功。

***

# 参考文献

[26] 陈芳.一种基于错切原理的图像旋转方法[J].淮阴师范学院学报（自然科学版）,2004,3(4):319-322.DOI:10.3969/j.issn.1671-6876.2004.04.016.
[27] 王金辉.实时图像旋转系统的研究与FPGA实现[D].华中科技大学,2012.

***

# 感谢

仿真图像来源：
[041-マツムシソウ](http://www.pixiv.net/member_illust.php?mode=medium&illust_id=49603329)

<script type="text/javascript" src="http://src.dtysky.moe/MathJax/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>