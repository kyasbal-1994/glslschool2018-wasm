(module
 (type $v (func))
 (type $iiii (func (param i32 i32 i32) (result i32)))
 (type $ii (func (param i32) (result i32)))
 (type $iiiiii (func (param i32 i32 i32 i32 i32) (result i32)))
 (type $iiiiv (func (param i32 i32 i32 i32)))
 (global $~lib/allocator/arena/startOffset (mut i32) (i32.const 0))
 (global $~lib/allocator/arena/offset (mut i32) (i32.const 0))
 (memory $0 0)
 (export "memory" (memory $0))
 (export "detectlines" (func $assembly/index/detectlines))
 (start $start)
 (func $~lib/allocator/arena/__memory_allocate (; 0 ;) (type $ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  ;;@ ~lib/allocator/arena.ts:18:2
  (if
   ;;@ ~lib/allocator/arena.ts:18:6
   (get_local $0)
   ;;@ ~lib/allocator/arena.ts:18:12
   (block
    ;;@ ~lib/allocator/arena.ts:19:4
    (if
     ;;@ ~lib/allocator/arena.ts:19:8
     (i32.gt_u
      (get_local $0)
      (i32.const 1073741824)
     )
     ;;@ ~lib/allocator/arena.ts:19:28
     (unreachable)
    )
    ;;@ ~lib/allocator/arena.ts:23:4
    (if
     ;;@ ~lib/allocator/arena.ts:23:8
     (i32.gt_u
      ;;@ ~lib/allocator/arena.ts:21:4
      (tee_local $0
       ;;@ ~lib/allocator/arena.ts:21:17
       (i32.and
        (i32.add
         ;;@ ~lib/allocator/arena.ts:21:18
         (i32.add
          ;;@ ~lib/allocator/arena.ts:20:4
          (tee_local $1
           ;;@ ~lib/allocator/arena.ts:20:14
           (get_global $~lib/allocator/arena/offset)
          )
          ;;@ ~lib/allocator/arena.ts:21:24
          (get_local $0)
         )
         (i32.const 7)
        )
        (i32.const -8)
       )
      )
      ;;@ ~lib/allocator/arena.ts:23:17
      (i32.shl
       ;;@ ~lib/allocator/arena.ts:22:4
       (tee_local $2
        ;;@ ~lib/allocator/arena.ts:22:29
        (current_memory)
       )
       ;;@ ~lib/allocator/arena.ts:23:39
       (i32.const 16)
      )
     )
     ;;@ ~lib/allocator/arena.ts:26:6
     (if
      ;;@ ~lib/allocator/arena.ts:26:10
      (i32.lt_s
       ;;@ ~lib/allocator/arena.ts:26:17
       (grow_memory
        ;;@ ~lib/allocator/arena.ts:25:24
        (select
         ;;@ ~lib/allocator/arena.ts:25:28
         (get_local $2)
         (tee_local $4
          ;;@ ~lib/allocator/arena.ts:24:6
          (tee_local $3
           ;;@ ~lib/allocator/arena.ts:24:24
           (i32.shr_u
            (i32.and
             ;;@ ~lib/allocator/arena.ts:24:25
             (i32.add
              ;;@ ~lib/allocator/arena.ts:24:26
              (i32.sub
               (get_local $0)
               ;;@ ~lib/allocator/arena.ts:24:35
               (get_local $1)
              )
              ;;@ ~lib/allocator/arena.ts:24:41
              (i32.const 65535)
             )
             (i32.const -65536)
            )
            ;;@ ~lib/allocator/arena.ts:24:64
            (i32.const 16)
           )
          )
         )
         (i32.gt_s
          (get_local $2)
          (get_local $4)
         )
        )
       )
       ;;@ ~lib/allocator/arena.ts:26:37
       (i32.const 0)
      )
      ;;@ ~lib/allocator/arena.ts:26:40
      (if
       ;;@ ~lib/allocator/arena.ts:27:12
       (i32.lt_s
        ;;@ ~lib/allocator/arena.ts:27:19
        (grow_memory
         ;;@ ~lib/allocator/arena.ts:27:24
         (get_local $3)
        )
        ;;@ ~lib/allocator/arena.ts:27:39
        (i32.const 0)
       )
       ;;@ ~lib/allocator/arena.ts:27:42
       (unreachable)
      )
     )
    )
    ;;@ ~lib/allocator/arena.ts:32:4
    (set_global $~lib/allocator/arena/offset
     ;;@ ~lib/allocator/arena.ts:32:13
     (get_local $0)
    )
    ;;@ ~lib/allocator/arena.ts:33:11
    (return
     (get_local $1)
    )
   )
  )
  ;;@ ~lib/allocator/arena.ts:35:9
  (i32.const 0)
 )
 (func $assembly/Texture/Texture4CH#constructor (; 1 ;) (type $iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (if (result i32)
   (get_local $0)
   (get_local $0)
   (block (result i32)
    (i32.store
     (tee_local $3
      (call $~lib/allocator/arena/__memory_allocate
       (i32.const 9)
      )
     )
     ;;@ assembly/Texture.ts:8:28
     (i32.const 0)
    )
    (i32.store16 offset=4
     (get_local $3)
     ;;@ assembly/Texture.ts:10:22
     (i32.const 0)
    )
    (i32.store16 offset=6
     (get_local $3)
     ;;@ assembly/Texture.ts:12:23
     (i32.const 0)
    )
    (i32.store8 offset=8
     (get_local $3)
     ;;@ assembly/Texture.ts:14:18
     (i32.const 0)
    )
    (get_local $3)
   )
  )
 )
 (func $assembly/Texture/U8_4#constructor (; 2 ;) (type $iiiiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  (local $5 i32)
  (if (result i32)
   (get_local $0)
   (get_local $0)
   (block (result i32)
    (i32.store8
     (tee_local $5
      (call $~lib/allocator/arena/__memory_allocate
       (i32.const 4)
      )
     )
     (get_local $1)
    )
    (i32.store8 offset=1
     (get_local $5)
     (get_local $2)
    )
    (i32.store8 offset=2
     (get_local $5)
     (get_local $3)
    )
    (i32.store8 offset=3
     (get_local $5)
     (get_local $4)
    )
    (get_local $5)
   )
  )
 )
 (func $assembly/Texture/Texture#getAddressAt (; 3 ;) (type $iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  ;;@ assembly/Texture.ts:24:59
  (i32.mul
   ;;@ assembly/Texture.ts:24:11
   (i32.add
    ;;@ assembly/Texture.ts:24:12
    (i32.mul
     (i32.and
      (get_local $1)
      (i32.const 65535)
     )
     ;;@ assembly/Texture.ts:24:21
     (i32.load16_u offset=4
      ;;@ assembly/Texture.ts:24:26
      (get_local $0)
     )
    )
    ;;@ assembly/Texture.ts:24:39
    (i32.and
     (get_local $2)
     (i32.const 65535)
    )
   )
   ;;@ assembly/Texture.ts:24:49
   (i32.load8_u offset=8
    ;;@ assembly/Texture.ts:24:54
    (get_local $0)
   )
  )
 )
 (func $assembly/Texture/Texture4CH#setAt (; 4 ;) (type $iiiiv) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  ;;@ assembly/Texture.ts:44:4
  (i32.store8
   ;;@ assembly/Texture.ts:43:4
   (tee_local $4
    ;;@ assembly/Texture.ts:43:23
    (call $assembly/Texture/Texture#getAddressAt
     ;;@ assembly/Texture.ts:43:18
     (get_local $0)
     ;;@ assembly/Texture.ts:43:36
     (get_local $1)
     ;;@ assembly/Texture.ts:43:39
     (get_local $2)
    )
   )
   ;;@ assembly/Texture.ts:44:18
   (i32.load8_u
    (get_local $3)
   )
  )
  ;;@ assembly/Texture.ts:45:4
  (i32.store8 offset=1
   ;;@ assembly/Texture.ts:45:14
   (get_local $4)
   ;;@ assembly/Texture.ts:45:18
   (i32.load8_u offset=1
    (get_local $3)
   )
  )
  ;;@ assembly/Texture.ts:46:4
  (i32.store8 offset=2
   ;;@ assembly/Texture.ts:46:14
   (get_local $4)
   ;;@ assembly/Texture.ts:46:18
   (i32.load8_u offset=2
    (get_local $3)
   )
  )
  ;;@ assembly/Texture.ts:47:4
  (i32.store8 offset=3
   ;;@ assembly/Texture.ts:47:14
   (get_local $4)
   ;;@ assembly/Texture.ts:47:18
   (i32.load8_u offset=3
    (get_local $3)
   )
  )
 )
 (func $assembly/index/detectlines (; 5 ;) (type $v)
  (local $0 i32)
  ;;@ assembly/index.ts:7:10
  (call $assembly/Texture/Texture4CH#setAt
   ;;@ assembly/index.ts:6:2
   (tee_local $0
    ;;@ assembly/index.ts:6:28
    (call $assembly/Texture/Texture4CH#constructor
     (i32.const 0)
     ;;@ assembly/index.ts:6:43
     (i32.const 512)
     ;;@ assembly/index.ts:6:48
     (i32.const 512)
    )
   )
   ;;@ assembly/index.ts:7:16
   (i32.const 0)
   ;;@ assembly/index.ts:7:19
   (i32.const 0)
   ;;@ assembly/index.ts:7:22
   (call $assembly/Texture/U8_4#constructor
    (i32.const 0)
    ;;@ assembly/index.ts:7:31
    (i32.const 1)
    ;;@ assembly/index.ts:7:34
    (i32.const 2)
    ;;@ assembly/index.ts:7:37
    (i32.const 3)
    ;;@ assembly/index.ts:7:40
    (i32.const 4)
   )
  )
  ;;@ assembly/index.ts:8:2
  (drop
   (call $assembly/Texture/U8_4#constructor
    (i32.const 0)
    (i32.load8_u
     (tee_local $0
      (call $assembly/Texture/Texture#getAddressAt
       ;;@ assembly/index.ts:8:16
       (get_local $0)
       (i32.const 0)
       (i32.const 0)
      )
     )
    )
    (i32.load8_u offset=1
     (get_local $0)
    )
    (i32.load8_u offset=2
     (get_local $0)
    )
    (i32.load8_u offset=3
     (get_local $0)
    )
   )
  )
 )
 (func $start (; 6 ;) (type $v)
  (set_global $~lib/allocator/arena/startOffset
   (i32.const 8)
  )
  (set_global $~lib/allocator/arena/offset
   ;;@ ~lib/allocator/arena.ts:13:20
   (get_global $~lib/allocator/arena/startOffset)
  )
 )
)
