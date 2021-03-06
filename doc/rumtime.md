
# rumtime 流程
1. 调用 createApp 
   1. 调用 createRenderer 创建 render 接收 runtime-dom 中的API
      1. createRenderer 接收 options 解构 在要使用的地方使用
      2. 调用 createAppAPI 传入 render 返回 createApp 函数
      3. 返回 render ：{createApp}
   2. 调用 render.createApp
      1. 闭包 rootComponent （顶级组件） 
      2. 返回 mount 函数
   3. 返回 render.createApp 返回值
2. 调用 mount
   1. 初始化 rootContainer -> DOM
   2. 调用 createVnode 接收 rootComponent
      1. 创建 type 表示 element 
      2. 创建 props 表示 上层传来的值
      3. 创建 children 表示 子元素
      4. 创建 shapeFlag 为 类型 使用 shapeFlags 思想 利用二进制数做多类型并处理
         1. 判断子节点为其增加 子节点类型。
   3. 调用 render 函数 对 createVnode 初始化的 vnode 进行一个处理 调用 patch 函数处理
      1. 调用 patch 判断组件类型
         1. Component 组件 调用 processComponent 处理
            1. 创建 主要的流程 利用 mountComponent 来处理 option 的内容，处理实例
               1. 利用 createComponentInstance 创建实例
                  1. initEmit 来对 emit 函数进行一个初始化
               2. 利用 setupComponent 处理 setup 
                  1. initProps -> 处理 props
                  2. initSlots -> 处理 slots
                  3. setupStatefulComponent 将 setup 转换为状态 
                     1. 绑定 option proxy -> this
                     2. 运行 setup 
                        1. setCurrentInstance 赋值 CurrentInstance
                        2. setup()
                        3. removeCurrentInstance 重制 CurrentInstance
                     3. handlerSetupResult 处理 setup 的返回值 
                        1. function -> render
                        2. object -> unRef(setupState)
                     4. finishSetupComponent 将 render 绑定在 instance 上
               3. setupRenderEffect
                  1. 绑定 组件级别 effect 来收集 Vnode 中使用的 响应值
                     1. 初始化阶段
                        1. 执行 instance.render 并绑定 this 值
                        2. 绑定 instance.subTree = instance.render // 当前组件虚拟DOM
                        3. 绑定 instance.vnode.el = instance.subTree.el // 当前虚拟DOM的真实DOM
                        4. 调用 patch 传入 instance.render  返回值 和 上一层 el -> 进入更新el组
                        5. 标记为已初始化
                     2. 更新阶段 
                        1. 判断 nextVnode 是否存在存在的话
                           1. 存在：证明是通过父节点更新来更新的
                              1. 将新的 vnode 传递来的内容更新到 instance 中
                                 1. instance.props = nextVnode.props
                                 2. instance.vnode = nextVnode
                              2. instance.next = null
                           2. 不存在：证明是通过更新自己来更新的
                        2. 通过 执行 instance.render 并绑定 this 值 获取新的 vnode
                        3. 通过 instance.subTree 获取旧的 vnode
                        4. 传入 patch 进行对比
                  2. 为 effect 传 scheduler 
                     1. scheduler 接收 instance.update 并判断 instance.update是否已经存在
                     2. 不存在则记录到一个 queue 中
                     3. 在一个微任务中执行queue中的函数（来保证一个 Event 中，只更新一个vnode)
                  3. 将 effect 绑定到 instance.update 上。用来自己促发更新
            2. 更新 updateComponent 处理 因为父亲组件发生更新而更新
               1. shouldUpdateComponent 判断是否需要更新
                  1. 需要更新：
                     1. 将 instance.next 设置为 nextVnode
                     2. 调用 instance.update 
                  2. 不需要更新：
                     1. 将旧Vnode 的内容更新到新Vnode上
                        1. el
                        2. component -> instance
                        3. 将 instance.vnode 修改为新的 vnode
         2. Element 调用 processElement 处理
            1. 调用 mountElement 初始化
               1. document.createElement 创建 节点 
               2. 循环 props 
                  1. 如果是 on 开头的就是 事件 使用 addEventListener 绑定
                  2. 其他 setAttribute 绑定
               3. 判断 shapeFlag 处理 children
                  1. text : el.textContent = children; 
                  2. Array : mountChildren(children, el)
                     1. 循环 children 调用 patch
               4. 赋值给 vnode.el
               5. container 添加新的 el
            2. 调用 updateElement 进行更新
               1. patchProps 更新 props  
                  1. nextProps 有，prevProps 没有 -> 增加
                  2. nextProps 有，prevProps 有 -> 修改
                  3. nextProps 有但是是 Undefined || null -> 删除
                  4. prevProps 有 nextProps 无 -> 删除
               2. patchChildren 更新 子节点
                  1. nextChildren 是 String, prevChildren 是 String
                     1. setElementText('nextChildren') 修改内容
                  2. nextCHildren 是 String, prevChildren 是 Array 
                     1. removeChild(prevChildren) 删除 prevChildren 子节点
                     2. setElementText('nextChildren') 将 nextChild 文字节点写入
                  3. nextChildren 是 Array , prevChildren 是 String
                     1. setElementText('') 清空
                     2. mountChildren(nextChild.children) 将新节点填入
                  4. nextChildren 是 Array , prevChildren 是 Array 
                     1. 判断两个点相同
                        1. 通过 type 
                        2. 通过 key ( 这就是为什么要写 key 的第一个原因)
                     2. 双端比较
                        1. 左循环(新旧Array都是0开始),右循环(新旧Array分别有结束key)
                           1. 相同点，path 子节点
                           2. 不同掉，跳出最后得到最小范围
                        2. 比较是否大段添加，删除
                           1. 开始 key > 旧结束key && 开始key <= 新结束key => 证明有新节点直接添加
                           2. 开始 key > 新结束key && 开始key <= 旧结束key => 证明有旧节点要删除
                        3. 比较后结余的点是 开始 key <= 旧结束key && 开始key <= 新结束key 剩下两不关
                           1. 功能点：
                              1. 比较后删除，增加
                              2. 更换相同点，位置
                           2. 实现：
                              1. 准备工作
                                 1. 获取 新节点个数
                                 2. 创建 新节点个数的数组（newIndexToOldIndexMap) 用来 计算最大子序列
                              2. 删除多余旧节点
                                 1. 将新节点通过 key 转为映射表（写key的第二个原因）
                                 2. 循环旧节点
                                    1. 收集数量是否等于新节点数量
                                       1. 不等于：
                                          1. 比较旧节点是否在新节点中存在
                                             1. 从新节点key映射表中比较
                                             2. 没有 key 的循环新节点比较
                                          2. 比较得到结果
                                             1. 存在 
                                                1. 收集节点，计算宗大子序列 [newIndex] = [oldIndex+1] 此处+1是为了保证0存在（新增）
                                                2. path
                                                3. 最大 newIndex 。如果 newIndex 每次都+1说明是顺序排列不需要进行增加和移位。如果不是则需要检测增加和移位。
                                                4. 记录收集数量 用到前面判断
                                             2. 不存在
                                                1. 删除节点
                                       2. 等于
                                          1. 直接删
                              3. 增加，移动 通过上面 最大 new Index 判断是否真的有乱序
                                 1. 有：
                                    1. 循环 新节点个数的数组(newIndexToOldIndexMap) length 循环（这样添加时就可以依据最后一位添加了）
                                       1. 判断 value 是否为 0 
                                          1. 为0: 添加 patch
                                          2. 判断 最大子序列 length 是为 0
                                             1. 是：不存在：挪动位置 hostInsert
                                             2. 不为0:判断是否存在于最大子
                                                1. 存在：最大子序列 length--;
                                                2. 不存在：挪位子
                                 2. 没有:结束
         3. Text 调用 processText 处理
            1. createTextNode 创建 文字节点
            2. 赋值给 vnode.el
            3. container.append 新节点
         4. Fragment 调用 processFragment 
            1. 调用 mountChildren 将 当前的 el 容器传入
               1. 循环 children 调用 patch

