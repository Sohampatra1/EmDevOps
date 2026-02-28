export const DEBUG_SCENARIOS = [
    {
        title: 'Memory Corruption: Buffer Overflow',
        type: 'DEBUG' as const,
        difficulty: 'HARD' as const,
        description: 'A sensor driver is writing corrupted data. The system crashes intermittently during high-load conditions. Analyze the logs and find the root cause.',
        logs: `[00:00:01.234] SensorDriver: Init OK, buffer_size=64
[00:00:01.235] SensorDriver: DMA transfer started, dest=0x20001000
[00:00:05.100] SensorDriver: Read 72 bytes from sensor (expected 64)
[00:00:05.101] WARNING: Write beyond buffer boundary detected
[00:00:05.102] MemManager: Heap corruption detected at 0x20001040
[00:00:05.103] FATAL: Hard fault at PC=0x08001234
[00:00:05.103] Register dump: R0=0xDEADBEEF R1=0x20001040 LR=0x08001200
[00:00:05.104] Stack trace:
  #0 SensorDriver::readData() at sensor_driver.c:87
  #1 DataProcessor::update() at data_proc.c:45
  #2 main_loop() at main.c:120`,
        rootCause: 'Buffer overflow: sensor returned 72 bytes but buffer was only 64 bytes. The DMA transfer wrote 8 bytes past the buffer boundary, corrupting adjacent heap memory.',
        tags: ['memory-corruption', 'buffer-overflow', 'embedded-debugging'],
        companyTags: ['Bosch', 'Continental'],
    },
    {
        title: 'Race Condition: Shared Resource',
        type: 'DEBUG' as const,
        difficulty: 'HARD' as const,
        description: 'Two tasks are accessing a shared configuration structure. Intermittent data corruption is observed. Find the race condition.',
        logs: `[T=100ms] Task_Config: Updating config.threshold = 150
[T=100ms] Task_Sensor: Reading config.threshold (got 0x00960000 = corrupted)
[T=101ms] Task_Config: Config write complete
[T=102ms] Task_Sensor: ERROR: Invalid threshold value, applying default
[T=200ms] Task_Config: Updating config.mode = 2
[T=200ms] Task_Sensor: Reading config.mode (got 2 = OK)
[T=500ms] Task_Config: Updating config.threshold = 200
[T=500ms] Task_Sensor: Reading config.threshold (got 0xC8000000 = corrupted)
Note: config structure is packed, threshold is uint32_t at offset 4`,
        rootCause: 'Non-atomic 32-bit write on a platform where the bus width is 16-bit. The config write is split into two 16-bit operations, and Task_Sensor reads between them, getting a half-updated value. Solution: use a mutex or atomic operations.',
        tags: ['race-condition', 'concurrency', 'embedded-debugging'],
        companyTags: ['BMW', 'Bosch'],
    },
    {
        title: 'Stack Overflow: Recursive ISR',
        type: 'DEBUG' as const,
        difficulty: 'MEDIUM' as const,
        description: 'The system crashes with a hard fault during interrupt processing. The stack appears corrupted.',
        logs: `[ISR] Timer_IRQ: Processing tick 1000
[ISR] Timer_IRQ: Calling updateDisplay()
[ISR] SPI_IRQ: SPI transfer complete (nested in Timer_IRQ)
[ISR] Timer_IRQ: Processing tick 1001 (nested!)
[ISR] Timer_IRQ: Calling updateDisplay()
[ISR] SPI_IRQ: SPI transfer complete
[ISR] Timer_IRQ: Processing tick 1002 (nested!)
[FAULT] Stack overflow detected, SP=0x20000010 (stack base=0x20000000)
[FAULT] Hard fault handler entered
[FAULT] PSP=0x1FFFFFFC (below stack region)`,
        rootCause: 'Timer ISR is being re-entered because the interrupt flag is not cleared before calling updateDisplay(), which triggers an SPI transfer that takes long enough for the next timer tick to arrive. Solution: clear the interrupt flag at the start of the ISR.',
        tags: ['stack-overflow', 'interrupt', 'embedded-debugging'],
        companyTags: ['Continental', 'Elektrobit'],
    },
    {
        title: 'Deadlock: Mutex Ordering',
        type: 'DEBUG' as const,
        difficulty: 'HARD' as const,
        description: 'Two RTOS tasks are frozen. The watchdog timer is about to fire. Analyze the task states.',
        logs: `[RTOS] Task states at watchdog trigger:
  Task_CAN:   BLOCKED (waiting for Mutex_Config, holding Mutex_CAN)
  Task_Diag:  BLOCKED (waiting for Mutex_CAN, holding Mutex_Config)
  Task_Main:  READY
  Task_Idle:  RUNNING

[RTOS] Mutex ownership:
  Mutex_CAN:    owned by Task_CAN (held for 5000ms)
  Mutex_Config: owned by Task_Diag (held for 5000ms)

[RTOS] Lock acquisition order:
  Task_CAN:  lock(Mutex_CAN) → lock(Mutex_Config)
  Task_Diag: lock(Mutex_Config) → lock(Mutex_CAN)`,
        rootCause: 'Classic ABBA deadlock. Task_CAN acquires mutexes in order (CAN, Config) while Task_Diag acquires them in reverse order (Config, CAN). Solution: enforce consistent lock ordering or use a lock hierarchy.',
        tags: ['deadlock', 'rtos', 'mutex', 'embedded-debugging'],
        companyTags: ['Bosch', 'BMW', 'Continental'],
    },
    {
        title: 'Interrupt Storm: GPIO Bouncing',
        type: 'DEBUG' as const,
        difficulty: 'MEDIUM' as const,
        description: 'The system becomes unresponsive after a button press. CPU utilization jumps to 100% and stays there.',
        logs: `[T=0ms]   GPIO_IRQ: Button press detected
[T=0ms]   GPIO_IRQ: Button release detected
[T=0ms]   GPIO_IRQ: Button press detected
[T=1ms]   GPIO_IRQ: Button release detected
[T=1ms]   GPIO_IRQ: Button press detected
... (repeats 1000+ times in 10ms)
[T=10ms]  PERF: CPU in ISR context: 99.8%
[T=10ms]  PERF: Main loop starvation detected
[T=50ms]  WATCHDOG: Warning - main loop not responding
[T=100ms] WATCHDOG: System reset triggered`,
        rootCause: 'Mechanical switch bounce causing an interrupt storm. Each bounce generates a rising/falling edge interrupt. Without debouncing (hardware RC filter or software timer-based debounce), the CPU spends all time in ISR context. Solution: implement software debounce with a timer, or add hardware debounce circuit.',
        tags: ['interrupt-storm', 'gpio', 'debounce', 'embedded-debugging'],
        companyTags: ['Siemens', 'Bosch', 'Continental'],
    },
]

export const HIL_SCENARIOS = [
    {
        title: 'HIL Test Case Failure: CAN Message Timing',
        description: 'A HIL test for brake light activation is failing intermittently. The CAN message arrives but the response is outside the timing window.',
        logs: `[HIL] Test: BrakeLightActivation_TC001
[HIL] Step 1: Send CAN msg ID=0x100 (BrakePedalPressed=1)  ... OK
[HIL] Step 2: Wait for CAN msg ID=0x200 (BrakeLight=ON)
[HIL] Expected: Response within 50ms
[HIL] Actual: Response received at T+67ms
[HIL] RESULT: FAIL (timing violation: 67ms > 50ms threshold)
[HIL] DUT CPU load during test: 87%
[HIL] CAN bus load: 65%`,
        rootCause: 'High CPU load (87%) causing delayed CAN message processing. The task priority for CAN Tx might be too low, or a higher-priority task is starving it.',
    },
    {
        title: 'Hardware Not Responding: Power Supply Issue',
        description: 'The HIL rig cannot communicate with the DUT (Device Under Test). All CAN and diagnostic connections fail.',
        logs: `[HIL] Initializing test rig...
[HIL] Power supply: CH1=12.0V OK, CH2=5.0V OK
[HIL] CAN interface: Vector VN1640 initialized
[HIL] Connecting to DUT...
[HIL] Sending diagnostic request (UDS 0x3E TesterPresent)
[HIL] ERROR: No response from DUT (timeout 2000ms)
[HIL] Retry 1: No response
[HIL] Retry 2: No response
[HIL] Checking power supply: CH1=11.2V (WARNING: below 11.5V threshold)
[HIL] DUT current draw: 2.8A (expected: 0.5A)`,
        rootCause: 'Excessive current draw indicates a possible short circuit on the DUT. The voltage drop to 11.2V is causing the ECU voltage regulator to go into under-voltage protection, keeping the MCU in reset.',
    },
    {
        title: 'CAN Bus Timeout: Frame Error',
        description: 'CAN communication drops after exactly 127 errors. The bus goes to bus-off state.',
        logs: `[HIL] CAN Bus Monitor:
[T=0s]   TX Error Counter: 0, RX Error Counter: 0
[T=1s]   CAN frame 0x100 sent OK
[T=1s]   ERROR: CAN frame 0x200 ACK error
[T=1s]   TX Error Counter: 8
[T=2s]   Multiple ACK errors detected
[T=5s]   TX Error Counter: 120 (Error Passive state)
[T=6s]   TX Error Counter: 128
[T=6s]   CAN controller entered BUS-OFF state
[T=6s]   All communication stopped`,
        rootCause: 'Missing CAN termination resistor (120Ω) on one end of the bus, causing signal reflections and ACK errors. The error counter increments to 128, triggering CAN bus-off per ISO 11898.',
    },
    {
        title: 'Sensor Misread: ADC Calibration',
        description: 'Temperature sensor readings are consistently 15°C higher than the reference. DUT firmware was recently updated.',
        logs: `[HIL] Sensor Calibration Test:
[HIL] Reference temp: 25.0°C (calibrated thermocouple)
[HIL] DUT reading: 40.2°C
[HIL] Delta: +15.2°C (FAIL: max allowed ±2°C)
[HIL] Reference temp: 50.0°C
[HIL] DUT reading: 65.1°C
[HIL] Delta: +15.1°C (FAIL)
[HIL] ADC raw value at 25°C: 2048 (expected: 1638)
[HIL] Note: Firmware v2.1 changed ADC reference from 3.3V to 2.5V
[HIL] Calibration table was not updated for new reference voltage`,
        rootCause: 'Firmware update changed the ADC reference voltage from 3.3V to 2.5V but the calibration lookup table was not updated. The ADC codes map to wrong temperature values. The consistent ~15°C offset confirms a systematic calibration error.',
    },
]
