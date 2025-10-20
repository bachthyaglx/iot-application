/* eslint-disable linebreak-style */
require('dotenv').config()
const mongoose = require('mongoose')
const Ports = require('../models/ports')
const User = require('../models/user')

const devicePortsData = [
  {
    portId: 'XD1',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'PWRIN',
      descr: 'M12, L-coded, 4-Pin, male',
      capabilities: '9 A',
      configuration: {
        label: 'XD1'
      }
    }
  },
  {
    portId: 'XD2',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'PWROUT',
      descr: 'M12, L-coded, 4-Pin, female',
      capabilities: '9 A',
      configuration: {
        label: 'XD2'
      }
    }
  },
  {
    portId: 'XF1',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'ETH',
      descr: 'M12, D-coded, female',
      capabilities: '100-BaseTX',
      status: {
        mode: '100FD',
        speed: 1000000
      },
      configuration: {
        adminstate: 'enabled',
        portmode: 'FD',
        mdi: 'MDIX',
        label: 'XF1'
      }
    }
  },
  {
    portId: 'XF2',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'ETH',
      descr: 'M12, D-coded, female',
      capabilities: '100-BaseTX',
      status: {
        mode: '100HD',
        speed: 1000000
      },
      configuration: {
        adminstate: 'enabled',
        portmode: 'FD',
        mdi: 'MDIX',
        label: 'XF2'
      }
    }
  },
  {
    portId: 'X0',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'IOL',
      descr: 'M12, A-coded female',
      capabilities: {
        maxPowerSupply: {
          value: 0.3,
          unit: 'A'
        },
        portType: 'CLASS_A'
      },
      configuration: {
        mode: 'DIGITAL_INPUT',
        validationAndBackup: 'TYPE_COMPATIBLE_DEVICE_V1.1',
        iqConfiguration: 'DIGITAL_INPUT',
        deviceAlias: 'Distance_sensor_1',
        label: 'X0'
      },
      status: 'DIGITAL_INPUT_C/Q'
    }
  },
  {
    portId: 'X1',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'IOL',
      descr: 'M12, A-coded, female',
      capabilities: {
        maxPowerSupply: {
          value: 2,
          unit: 'A'
        },
        portType: 'CLASS_B'
      },
      configuration: {
        mode: 'IOLINK_MANUAL',
        validationAndBackup: 'TYPE_COMPATIBLE_DEVICE_V1.1',
        iqConfiguration: 'DIGITAL_INPUT',
        cycleTime: {
          value: 2.3,
          unit: 'ms'
        },
        label: 'X1',
        vendorId: 26,
        deviceId: 333,
        deviceAlias: 'Distance_sensor_1',
        datastorage: {
          header: {
            vendorId: 26,
            deviceId: 333,
            ioLinkRevision: '1.1',
            parameterChecksum: 123456
          },
          content: 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGl'
        }
      },
      status: {
        statusInfo: 'DEVICE_ONLINE',
        ioLinkRevision: '1.1',
        transmissionRate: 'COM2',
        masterCycleTime: {
          value: 2.3,
          unit: 'ms'
        }
      }
    }
  },
  {
    portId: 'X2',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'IOL',
      descr: 'M12, A-coded, female',
      capabilities: '',
      configuration: {
        mode: 'IOLINK_AUTOSTART',
        validationAndBackup: 'TYPE_COMPATIBLE_DEVICE_V1.1',
        iqConfiguration: 'DIGITAL_INPUT',
        cycleTime: {
          value: 5.6,
          unit: 'ms'
        },
        label: 'X2',
        vendorId: 303,
        deviceId: 123,
        deviceAlias: 'Sensor_2'
      },
      status: {
        statusInfo: 'COMMUNICATION_LOST'
      }
    }
  },
  {
    portId: 'X3',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'IOL',
      descr: 'M12, A-coded, female',
      capabilities: '100-BaseTX',
      status: {
        mode: '100FD',
        speed: 1000000
      },
      configuration: {
        adminstate: 'enabled',
        portmode: 'FD',
        mdi: 'MDIX',
        label: 'X3'
      }
    }
  },
  {
    portId: 'X4',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'IOL',
      descr: 'M12, A-coded, female',
      capabilities: '100-BaseTX',
      status: {
        mode: '100FD',
        speed: 1000000
      },
      configuration: {
        adminstate: 'enabled',
        portmode: 'FD',
        mdi: 'MDIX',
        label: 'X4'
      }
    }
  },
  {
    portId: 'X5',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'IOL',
      descr: 'M12, A-coded, female',
      capabilities: '100-BaseTX',
      status: {
        mode: '100FD',
        speed: 1000000
      },
      configuration: {
        adminstate: 'enabled',
        portmode: 'FD',
        mdi: 'MDIX',
        label: 'X5'
      }
    }
  },
  {
    portId: 'X6',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'IOL',
      descr: 'M12, A-coded, female',
      capabilities: '100-BaseTX',
      status: {
        mode: '100FD',
        speed: 1000000
      },
      configuration: {
        adminstate: 'enabled',
        portmode: 'FD',
        mdi: 'MDIX',
        label: 'X6'
      }
    }
  },
  {
    portId: 'X7',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'IOL',
      descr: 'M12, A-coded, female',
      capabilities: '100-BaseTX',
      status: {
        mode: '100FD',
        speed: 1000000
      },
      configuration: {
        adminstate: 'enabled',
        portmode: 'FD',
        mdi: 'MDIX',
        label: 'X7'
      }
    }
  },
  {
    portId: 'HMI',
    fields: ['type', 'descr', 'capabilities', 'configuration', 'status'],
    data: {
      type: 'HMI',
      descr: 'Rotary Switch',
      capabilities: '000-999',
      configuration: {}, // 🔥 Changed from '' to {}
      status: '999'
    }
  }
]

const seedDevicePorts = async () => {
  try {
    console.log('🌱 Seeding device ports...')

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const devicesExist = await Ports.exists({})
    if (devicesExist) {
      console.log('ℹ️  Device ports already exist. Skipping seed.')
      await mongoose.connection.close()
      process.exit(0)
    }

    const user = await User.findOne({ username: 'admin' })
    if (!user) {
      console.error('❌ Admin user not found. Please create the admin user first.')
      await mongoose.connection.close()
      process.exit(1)
    }

    // Add user reference to all ports
    const portsWithUser = devicePortsData.map(port => ({
      ...port,
      user: user._id
    }))

    await Ports.insertMany(portsWithUser)
    console.log(`✅ ${devicePortsData.length} device ports seeded successfully.`)

    await mongoose.connection.close()
    console.log('✅ Database connection closed')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err.message)
    console.error(err)
    process.exit(1)
  }
}

// Run the seed function
seedDevicePorts()